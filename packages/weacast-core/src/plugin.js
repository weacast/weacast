import logger from 'winston'
import makeDebug from 'debug'
import errors from 'feathers-errors'

// Create all element services
export default function initializePlugin (app, name, servicesPath) {
  const debug = makeDebug('weacast:weacast-' + name)

  const forecasts = app.get('forecasts') ? app.get('forecasts').filter(forecast => forecast.model === name) : []
  if (!forecasts.length) {
    logger.warn('Cannot find valid ' + name + ' plugin configuration in application')
    return
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
      let service = app.createElementService(forecast, element, servicesPath, element.serviceOptions)
      if (forecast.updateInterval >= 0) {
        // Trigger the initial harvesting, i.e. try data refresh for current time
        service.updateForecastData().catch(error => logger.error(error.message))
        // Then plan next updates according to provided update interval if required
        if (forecast.updateInterval > 0) {
          setInterval(_ => service.updateForecastData().catch(error => logger.error(error.message)), 1000 * forecast.updateInterval)
        }
      }
    }
  }
}
