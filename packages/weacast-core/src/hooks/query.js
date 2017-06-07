import moment from 'moment'
import fs from 'fs-extra'
import logger from 'winston'
import _ from 'lodash'
import makeDebug from 'debug'
import { getItems, replaceItems, discard } from 'feathers-hooks-common'
import { Grid } from '../grid'

const debug = makeDebug('weacast:weacast-core')
const discardDataField = discard('data')
const discardFilepathField = discard('filePath')
const discardConvertedFilepathField = discard('convertedFilePath')

function marshallComparisonFieldsInQuery (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallComparisonFieldsInQuery(value)
    } else if ((value === '$lt') || (value === '$lte') || (value === '$gt') || (value === '$gte')) {
      let number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      }
    }
  })
}

export function marshallComparisonQuery (hook) {
  let query = hook.params.query
  if (query) {
    marshallComparisonFieldsInQuery(query)
  }
}

export function marshallQuery (hook) {
  let query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : string or moment dates
    if (typeof query.runTime === 'string') {
      query.runTime = new Date(query.runTime)
    } else if (moment.isMoment(query.runTime)) {
      query.runTime = new Date(query.runTime.format())
    }
    if (typeof query.forecastTime === 'string') {
      query.forecastTime = new Date(query.forecastTime)
    } else if (moment.isMoment(query.forecastTime)) {
      query.forecastTime = new Date(query.forecastTime.format())
    }
    // In this case take care that we always internally require the file path, it will be removed for the client by another hook
    if (query.$select && this.element && this.element.dataStore === 'fs') {
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

function marshallGeometryQuery (query) {
  if (typeof query.geometry === 'object') {
    // Geospatial operators begin with $
    let geoOperator = _.keys(query.geometry).find(key => key.startsWith('$'))
    geoOperator = query.geometry[geoOperator]
    _.forOwn(geoOperator, (value, key) => {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (value.coordinates) {
          value.coordinates = value.coordinates.map(coordinate => _.toNumber(coordinate))
        } else {
          // Other simple values
          geoOperator[key] = _.toNumber(value)
        }
      }
    })
  }
}

export function marshallSpatialQuery (hook) {
  let query = hook.params.query
  if (query) {
    marshallGeometryQuery(query)
    // Resampling is used by hooks only, do not send it to DB
    if (query.oLon && query.oLat && query.sLon && query.sLat && query.dLon && query.dLat) {
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
    if (query.centerLon && query.centerLat && query.distance) {
      let lon = _.toNumber(query.centerLon)
      let lat = _.toNumber(query.centerLat)
      let d = _.toNumber(query.distance)
      // Transform to MongoDB spatial request
      delete query.centerLon
      delete query.centerLat
      delete query.distance
      query.geometry = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: d
        }
      }
    }
  }
}

export function processForecastTime (hook) {
  let query = hook.params.query
  if (query && query.time) {
    // Find nearest forecast time corresponding to request time
    let time = (typeof query.time === 'string' ? moment.utc(query.time) : query.time)
    let forecastTime = hook.service.getNearestForecastTime(time)
    delete query.time
    query.forecastTime = new Date(forecastTime.format())
  }
  if (query && query.from && query.to) {
    // Find nearest forecast time corresponding to request time range
    let from = (typeof query.from === 'string' ? moment.utc(query.from) : query.from)
    let to = (typeof query.to === 'string' ? moment.utc(query.to) : query.to)
    let fromForecastTime = hook.service.getNearestForecastTime(from)
    let toForecastTime = hook.service.getNearestForecastTime(to)
    delete query.from
    delete query.to
    query.forecastTime = {
      $gte: new Date(fromForecastTime.format()),
      $lte: new Date(toForecastTime.format())
    }
  }
}

export function processData (hook) {
  let params = hook.params
  let query = params.query
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  // If we use a file based storage we have to load data on demand
  if (this.element.dataStore === 'fs') {
    // Process data files when required
    if (query && query.$select && query.$select.includes('data')) {
      return new Promise((resolve, reject) => {
        let dataPromises = []
        items.forEach(item => {
          dataPromises.push(
            fs.readJson(item.convertedFilePath, 'utf8')
            .then(grid => {
              item.data = grid
              return item
            })
            .catch(error => {
              let errorMessage = 'Cannot read converted ' + this.forecast.name + '/' + this.element.name + ' forecast'
              if (item.forecastTime) errorMessage += ' at ' + item.forecastTime.format()
              if (item.runTime) errorMessage += ' for run ' + item.runTime.format()
              logger.error(errorMessage)
              debug('Input JSON file was : ' + item.convertedFilePath)
              reject(error)
            })
          )
        })

        Promise.all(dataPromises).then(_ => {
          // Remove as well any sensitive information about file path on the client side
          // Must be done second as we need this information first to read data
          discardFilepathField(hook)
          discardConvertedFilepathField(hook)
          replaceItems(hook, isArray ? items : items[0])
          resolve(hook)
        })
      })
    } else {
      // Remove any sensitive information about file path on the client side
      discardFilepathField(hook)
      discardConvertedFilepathField(hook)
    }
  } else {
    // Only discard if not explicitely asked by $select
    if (!query || !query.$select || !query.$select.includes('data')) {
      discardDataField(hook)
    } else {
      // Check for resampling on returned data
      if (params.oLon && params.oLat && params.sLon && params.sLat && params.dLon && params.dLat) {
        items.forEach(item => {
          let grid = new Grid({
            bounds: hook.service.forecast.bounds,
            origin: hook.service.forecast.origin,
            size: hook.service.forecast.size,
            resolution: hook.service.forecast.resolution,
            data: item.data
          })
          item.data = grid.resample([params.oLon, params.oLat], [params.dLon, params.dLat], [params.sLon, params.sLat])
        })
        replaceItems(hook, isArray ? items : items[0])
      }
    }
  }
}
