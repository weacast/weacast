import path from 'path'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-arpege')

import errors from 'feathers-errors'

export default function init () {
  const app = this;
  const forecasts = app.get('forecasts') ? app.get('forecasts').filter(forecast => forecast.model === 'arpege') : null
  if (!forecasts.length) {
    throw new errors.GeneralError('Cannot find valid ARPEGE plugin configuration in application')
  }

  debug('Initializing weacast-arpege plugin')
  const forecastsService = app.service('forecasts')
  // Iterate over configured forecast models
  for (let forecast of forecasts) {
    // Register the forecast model if not already done
    forecastsService.get(forecast.name)
    .then(_ => {
      forecastsService.patch(forecast.name, forecast)
    })
    .catch(_ => {
      forecastsService.create(forecast)
    })

    // Then generate services of the right type for each forecast element
    const createService = require('feathers-' + app.db.adapter)
    const configureModel = require(path.join(__dirname, 'models/arpege.model.' + app.db.adapter))
    for (let element of forecast.elements) {
      configureModel(element, app, options)
      app.use('/' + forecast.name + '/' + element.name, createService(options))
    }
  }
}
