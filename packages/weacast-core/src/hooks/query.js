import moment from 'moment'

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
}

export function excludeData(hook) {
    let query = hook.params.query
    if (query) {
      // By default do not response with data if not explicitely asked for
      // TODO
    }
}
