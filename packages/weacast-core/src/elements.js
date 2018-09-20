import logger from 'winston'

// Create all element services
export default function initializeElements (app, forecast, servicesPath) {
  logger.info('Initializing ' + forecast.name + ' forecast')
  const forecastsService = app.getService('forecasts')
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
      service.updateForecastData().catch(error => {
        logger.error(error.message)
        service.updateRunning = false
      })
      // Then plan next updates according to provided update interval if required
      if (forecast.updateInterval > 0) {
        logger.info('Installing forecast update on ' + service.forecast.name + '/' + service.element.name + ' with interval ' + forecast.updateInterval)
        setInterval(_ => {
          service.updateForecastData().catch(error => {
            logger.error(error.message)
            service.updateRunning = false
          })
        }, 1000 * forecast.updateInterval)
      }
    }
  }
}
