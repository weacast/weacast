import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import proto from 'uberproto'
import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-arpege')

import errors from 'feathers-errors'
import refreshMixin from './mixins/arpege.mixin.refresh'
import serviceMixin from './mixins/mixin.element'
import hooks from './services/arpege/arpege.hooks'

function createService (forecast, element, app) {
  const configureModel = require(path.join(__dirname, 'models/arpege.model.' + app.db.adapter))
  const createService = require('feathers-' + app.db.adapter)
  const options = {}
  configureModel(forecast, element, app, options)
  let service = createService(options)

  // Extend service with config and download methods
  service.app = app
  service.forecast = forecast
  service.element = element
  proto.mixin(refreshMixin, service)
  proto.mixin(serviceMixin, service)
  
  return service
}

export default function init () {
  const app = this;
  const forecasts = app.get('forecasts') ? app.get('forecasts').filter(forecast => forecast.model === 'arpege') : null
  if (!forecasts.length) {
    throw new errors.GeneralError('Cannot find valid ARPEGE plugin configuration in application')
  }

  debug('Initializing weacast-arpege plugin')
  const now = moment.utc()
  const forecastsService = app.service('forecasts')
  // Iterate over configured forecast models
  for (let forecast of forecasts) {
    debug('Initializing ' + forecast.name + ' forecast')
    // Register the forecast model if not already done
    forecastsService.find({ query: { name: forecast.name } })
    .then(result => {
      if (result.data.length > 0) {
        forecastsService.patch(result.data[0]._id, forecast)
      }
      else {
        forecastsService.create(forecast)
      }
    })

    // Then generate services of the right type for each forecast element
    let services = []
    for (let element of forecast.elements) {
      // Make sure we've got somewhere to put data and clean it up
      fs.emptyDirSync(path.join(app.get('forecastPath'), forecast.name, element.name))
      const servicePath = '/' + forecast.name + '/' + element.name
      app.use(servicePath, createService(forecast, element, app))
      let service = app.service(servicePath)
      // Add hooks
      service.hooks(hooks)
      // Keep reference
      services.push(service)
    }

    // Check for data on creation
    debug('Checking for up-to-date ' + forecast.name + ' forecast data')
    services.forEach(service => service.refreshData(now))
    // Then setup update process
    debug('Scheduling update process for ' + forecast.name + ' forecast data')
    setInterval( () => {
      const now = moment.utc()
      for (let service of services) {
        service.refreshData(now)
      }
    }, 1000 * forecast.updateInterval)
  }
}
