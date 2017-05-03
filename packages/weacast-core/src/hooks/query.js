import moment from 'moment'
import { discard } from 'feathers-hooks-common'
const discardDataField = discard('data')

export function marshallQuery(hook) {
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
    }
}

export function nearestForecastTime(hook) {
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

export function discardData(hook) {
    let query = hook.params.query
    // Only discard if not explicitely asked by $select
    if (!query || !query.$select || !query.$select.data) {
      discardDataField(hook)
    }
}
