import makeDebug from 'debug'
import errors from 'feathers-errors'
import { createElementService } from './service'

export default function initializePlugin (app, name, servicesPath) {
  const debug = makeDebug('weacast:weacast-' + name)

  const forecasts = app.get('forecasts') ? app.get('forecasts').filter(forecast => forecast.model === name) : null
  if (!forecasts.length) {
    throw new errors.GeneralError('Cannot find valid ' + name + ' plugin configuration in application')
  }

  debug('Initializing weacast-' + name + ' plugin')
  const forecastsService = app.service('forecasts')
  // Iterate over configured forecast models
  for (let forecast of forecasts) {
    debug('Initializing ' + forecast.name + ' forecast')
    // Register the forecast model if not already done
    forecastsService.find({
      query: {
        name: forecast.name,
        $select: ['_id', 'runTime', 'runTimeOffset', 'forecastTime'] // We only need object ID
      }
    })
    .then(result => {
      if (result.data.length > 0) {
        forecastsService.patch(result.data[0]._id, forecast)
      } else {
        forecastsService.create(forecast)
      }
    })

    // Then generate services of the right type for each forecast element
    for (let element of forecast.elements) {
      let service = createElementService(forecast, element, app, servicesPath)
      // Setup the update process, will trigger the initial harvesting
      debug('Launching update process for forecast data on ' + forecast.name + '/' + element.name)
      service.updateForecastData()
    }
  }
}
