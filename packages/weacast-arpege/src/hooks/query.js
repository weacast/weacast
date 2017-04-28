import moment from 'moment'

export function nearestForecastTime(hook) {
    let query = hook.params.query
    if (query && query.time) {
      // Find nearest forecast time corresponding to request time
      let time = moment(query.time)
      let forecastTime = hook.service.getNearestForecastTime(time)
      hook.params.forecastTime = forecastTime
    }
}

export function excludeData(hook) {
    let query = hook.params.query
    if (query) {
      // By default do not response with data if not explicitely asked for
      // TODO
    }
}
