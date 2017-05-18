import makeDebug from 'debug'
import errors from 'feathers-errors'

// Create all element services
export default function initializePlugin (app, name, servicesPath) {
  const debug = makeDebug('weacast:weacast-' + name)

  const forecasts = app.get('forecasts') ? app.get('forecasts').filter(forecast => forecast.model === name) : null
  if (!forecasts.length) {
    throw new errors.GeneralError('Cannot find valid ' + name + ' plugin configuration in application')
  }

  debug('Initializing weacast-' + name + ' plugin')
  const forecastsService = app.getService('forecasts')
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
      let service = app.createElementService(forecast, element, servicesPath)
      // Setup the update process, will trigger the initial harvesting
      if (forecast.updateInterval > 0) {
        debug('Launching update process for forecast data on ' + forecast.name + '/' + element.name)
        service.updateForecastData('interval')
      }
    }
  }
}
