import _ from 'lodash'
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
  // Create download buckets
  let elementBuckets = {}
  forecast.elements.forEach(element => {
    const bucket = element.bucket || 0
    // Initialize bucket
    if (!elementBuckets[bucket]) elementBuckets[bucket] = []
    elementBuckets[bucket].push(element)
  })

  // Then generate services for each forecast element in buckets
  elementBuckets = _.mapValues(elementBuckets, elements => {
    return elements.map(element => app.createElementService(forecast, element, servicesPath, element.serviceOptions))
  })

  async function update () {
    // Iterate over buckets
    const buckets = _.keys(elementBuckets)
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      // For each bucket launch download tasks in parallel
      await Promise.all(elementBuckets[bucket].map(service => {
        return service.updateForecastData().catch(error => {
          logger.error(error.message)
          service.updateRunning = false
        })
      }))
    }
  }

  if (forecast.updateInterval >= 0) {
    // Trigger the initial harvesting, i.e. try data refresh for current time
    // Add a small offset to wait for everything being initialized
    setTimeout(update, 5000)
    // Then plan next updates according to provided update interval if required
    if (forecast.updateInterval > 0) {
      logger.info('Installing forecast update on ' + forecast.name + ' with interval (s) ' + forecast.updateInterval)
      setInterval(update, 1000 * forecast.updateInterval)
    }
  }
}
