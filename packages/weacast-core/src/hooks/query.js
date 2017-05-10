import moment from 'moment'
import fs from 'fs-extra'
import logger from 'winston'
import makeDebug from 'debug'
import { getItems, replaceItems, discard } from 'feathers-hooks-common'

const debug = makeDebug('weacast:weacast-core')
const discardDataField = discard('data')
const discardFilepathField = discard('filePath')
const discardConvertedFilepathField = discard('convertedFilePath')

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
    if (query.$select && this.element.dataStore === 'fs') {
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
  let query = hook.params.query
    // If we use a file based storage we have to load data on demand
  if (this.element.dataStore === 'fs') {
      // Process data files when required
    if (query && query.$select && query.$select.includes('data')) {
      return new Promise((resolve, reject) => {
        let items = getItems(hook)
        items = (Array.isArray(items) ? items : [items])

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
              }))
        })

        Promise.all(dataPromises).then(_ => {
            // Remove as well any sensitive information about file path on the client side
            // Must be done second as we need this information first to read data
          discardFilepathField(hook)
          discardConvertedFilepathField(hook)
          replaceItems(hook, items)
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
    }
  }
}
