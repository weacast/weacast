import moment from 'moment'
import fs from 'fs-extra'
import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
import feathersHooks from 'feathers-hooks-common'
import { marshallTime } from './marshall.js'
import { Grid } from '../common/grid.js'

const { getItems, replaceItems, discard } = feathersHooks
const debug = makeDebug('weacast:weacast-core')
const discardDataField = discard('data')
const discardFilepathField = discard('filePath')
const discardConvertedFilepathField = discard('convertedFilePath')

function marshallComparisonFieldsInQuery (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallComparisonFieldsInQuery(value)
    } else if ((key === '$lt') || (key === '$lte') || (key === '$gt') || (key === '$gte')) {
      const number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      } else {
        // try for dates as well
        const date = moment.utc(value)
        if (date.isValid()) {
          queryObject[key] = new Date(date.valueOf())
        }
      }
    }
  })
}

export function marshallComparisonQuery (hook) {
  const query = hook.params.query
  if (query) {
    // Complex queries might have nested objects so we call a recursive function to handle this
    marshallComparisonFieldsInQuery(query)
  }
}

export function marshallQuery (hook) {
  const query = hook.params.query
  const service = hook.service

  if (query) {
    // Need to convert from client/server side types : string or moment dates
    marshallTime(query, 'runTime')
    marshallTime(query, 'forecastTime')

    // In this case take care that we always internally require the file path, it will be removed for the client by another hook
    if (!_.isNil(query.$select) && !_.isNil(service.element) && service.isExternalDataStorage()) {
      query.$select.push('convertedFilePath')
    }
    // When listing available forecast we might want to disable pagination
    // However disabling or changing the default pagination is not available in the client in Feathers by default,
    // this is the reason of this specific hook
    if (query.$paginate === 'false' || query.$paginate === false) {
      hook.params.paginate = false
      delete query.$paginate
    }
  }
}

function coordinatesToNumbers (value) {
  if (typeof value === 'string') {
    return _.toNumber(value)
  } else if (Array.isArray(value)) {
    return value.map(item => coordinatesToNumbers(item))
  } else {
    return value
  }
}

function marshallGeometryQuery (query) {
  if (typeof query.geometry === 'object') {
    // Geospatial operators begin with $
    let geoOperator = _.keys(query.geometry).find(key => key.startsWith('$'))
    // Specific case of exist
    if (geoOperator === '$exists') {
      const value = query.geometry.$exists
      query.geometry.$exists = (typeof value === 'string' ? (value === 'true' || value === '1') : value)
      return
    }
    geoOperator = query.geometry[geoOperator]
    _.forOwn(geoOperator, (value, key) => {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (!_.isNil(value.coordinates)) {
          value.coordinates = coordinatesToNumbers(value.coordinates)
        } else {
          // Other simple values or array of values
          geoOperator[key] = coordinatesToNumbers(value)
        }
      }
    })
  }
}

export function marshallTileQuery (hook) {
  const params = hook.params
  // Ensure we have a query object to update
  if (!params.query) params.query = {}
  const query = params.query
  // This ensure that when no geometry is specified we only access raw data
  if (!query.geometry && !_.has(query, 'x') && !_.has(query, 'y')) {
    query.geometry = { $exists: false }
  }
  // If no geometry query tile x/y can be directly provided
  if (typeof query.x === 'string') query.x = _.toNumber(query.x)
  if (typeof query.y === 'string') query.y = _.toNumber(query.y)
}

export function marshallSpatialQuery (hook) {
  const query = hook.params.query
  if (query) {
    marshallGeometryQuery(query)
    // Resampling is used by hooks only, do not send it to DB
    if (!_.isNil(query.oLon) && !_.isNil(query.oLat) && !_.isNil(query.sLon) && !_.isNil(query.sLat) && !_.isNil(query.dLon) && !_.isNil(query.dLat)) {
      // Convert when required from query strings
      hook.params.oLat = _.toNumber(query.oLat)
      hook.params.oLon = _.toNumber(query.oLon)
      hook.params.sLat = _.toNumber(query.sLat)
      hook.params.sLon = _.toNumber(query.sLon)
      hook.params.dLat = _.toNumber(query.dLat)
      hook.params.dLon = _.toNumber(query.dLon)
      delete query.oLat
      delete query.oLon
      delete query.sLat
      delete query.sLon
      delete query.dLat
      delete query.dLon
    }
    // Shortcut for proximity query
    if ((!_.isNil(query.centerLon) || !_.isNil(query.longitude)) &&
        (!_.isNil(query.centerLat) || !_.isNil(query.latitude)) && !_.isNil(query.distance)) {
      const longitude = (_.isNil(query.centerLon) ? _.toNumber(query.longitude) : _.toNumber(query.centerLon))
      const latitude = (_.isNil(query.centerLat) ? _.toNumber(query.latitude) : _.toNumber(query.centerLat))
      const distance = _.toNumber(query.distance)
      // Transform to MongoDB spatial request
      delete query.centerLon
      delete query.longitude
      delete query.centerLat
      delete query.latitude
      delete query.distance
      /* We switched from $near to $geoWithin due to https://github.com/weacast/weacast-core/issues/36
      query.geometry = {
        $near: {
          $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: distance
        }
      }
      */
      query.geometry = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], distance / 6378137.0] // Earth radius as in radians
        }
      }
    }
    // Shortcut for bbox query
    if (!_.isNil(query.south) && !_.isNil(query.north) && !_.isNil(query.west) && !_.isNil(query.east)) {
      const south = _.toNumber(query.south)
      const north = _.toNumber(query.north)
      const west = _.toNumber(query.west)
      const east = _.toNumber(query.east)
      // Transform to MongoDB spatial request
      delete query.south
      delete query.north
      delete query.west
      delete query.east
      query.geometry = {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: [ // BBox as a polygon
              [[west, south], [east, south], [east, north], [west, north], [west, south]] // Closing point
            ]
          }
        }
      }
    }
  }
}

export function processForecastTime (hook) {
  const query = hook.params.query
  const service = hook.service

  if (query && !_.isNil(query.time)) {
    // Find nearest forecast time corresponding to request time
    const time = (typeof query.time === 'string' ? moment.utc(query.time) : query.time)
    const forecastTime = service.getNearestForecastTime(time)
    delete query.time
    query.forecastTime = new Date(forecastTime.valueOf())
  }
  if (query && !_.isNil(query.from) && !_.isNil(query.to)) {
    // Find nearest forecast time corresponding to request time range
    const from = (typeof query.from === 'string' ? moment.utc(query.from) : query.from)
    const to = (typeof query.to === 'string' ? moment.utc(query.to) : query.to)
    const fromForecastTime = service.getNearestForecastTime(from)
    const toForecastTime = service.getNearestForecastTime(to)
    delete query.from
    delete query.to
    query.forecastTime = {
      $gte: new Date(fromForecastTime.valueOf()),
      $lte: new Date(toForecastTime.valueOf())
    }
  }
}

function readFile (service, item) {
  const inputPath = (path.isAbsolute(item.convertedFilePath)
    ? item.convertedFilePath
    : path.join(service.app.get('forecastPath'), item.convertedFilePath))

  return new Promise((resolve, reject) => {
    fs.readJson(inputPath, 'utf8')
      .then(grid => {
        item.data = grid
        resolve(item)
      })
      .catch(error => {
        let errorMessage = 'Cannot read converted ' + service.forecast.name + '/' + service.element.name + ' forecast'
        if (item.forecastTime) errorMessage += ' at ' + item.forecastTime.format()
        if (item.runTime) errorMessage += ' for run ' + item.runTime.format()
        service.app.logger.error(errorMessage)
        debug('Input JSON file was : ' + item.convertedFilePath)
        reject(error)
      })
  })
}

export async function processData (hook) {
  const params = hook.params
  const query = params.query
  const service = hook.service
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  // If we use a file based storage we have to load data on demand
  if (service.isExternalDataStorage()) {
    // Process data files when required
    if (query && !_.isNil(query.$select) && query.$select.includes('data')) {
      const dataPromises = []
      items.forEach(item => {
        // Except if we target tiles which have internal data
        if (item.convertedFilePath) {
          // In this case we need to extract from GridFS first
          if (service.element.dataStore === 'gridfs') {
            dataPromises.push(
              service.readFromGridFS(item.convertedFilePath)
                .then(_ => readFile(service, item))
            )
          } else {
            dataPromises.push(readFile(service, item))
          }
        }
      })
      // Something to be done ?
      if (dataPromises.length > 0) {
        await Promise.all(dataPromises)
        // In this case we need to remove extracted files as they are temporary
        if (service.element.dataStore === 'gridfs') {
          await Promise.all(items.map(item => fs.remove(item.convertedFilePath)))
        }
        replaceItems(hook, isArray ? items : items[0])
      }
    }
    // Remove any sensitive information about file path on the client side
    discardFilepathField(hook)
    discardConvertedFilepathField(hook)
  }
  // Only discard if not explicitely asked by $select
  if (_.isNil(query) || _.isNil(query.$select) || !query.$select.includes('data')) {
    discardDataField(hook)
  } else {
    // Check for resampling on returned data
    if (!_.isNil(params.oLon) && !_.isNil(params.oLat) && !_.isNil(params.sLon) && !_.isNil(params.sLat) && !_.isNil(params.dLon) && !_.isNil(params.dLat)) {
      items.forEach(item => {
        const grid = new Grid({
          bounds: service.forecast.bounds,
          origin: service.forecast.origin,
          size: service.forecast.size,
          resolution: service.forecast.resolution,
          data: item.data
        })
        item.data = grid.resample([params.oLon, params.oLat], [params.dLon, params.dLat], [params.sLon, params.sLat])
        // Update statistics
        Object.assign(item, Grid.getMinMax(item.data))
      })
      replaceItems(hook, isArray ? items : items[0])
    }
  }
}
