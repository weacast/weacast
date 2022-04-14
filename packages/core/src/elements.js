import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-core')

// Create all element services
export default async function initializeElements (app, forecast, servicesPath) {
  app.logger.info('Initializing ' + forecast.name + ' forecast')
  const forecastsService = app.getService('forecasts')
  // Register the forecast model if not already done
  const result = await forecastsService.find({
    query: {
      name: forecast.name,
      $select: ['_id'] // We only need object ID
    }
  })
  if (result.data.length > 0) {
    await forecastsService.patch(result.data[0]._id, forecast)
  } else {
    await forecastsService.create(forecast)
  }

  // Create download buckets
  const elementBuckets = {}
  forecast.elements.forEach(element => {
    const bucket = element.bucket || 0
    // Initialize bucket
    if (!elementBuckets[bucket]) elementBuckets[bucket] = []
    elementBuckets[bucket].push(element)
  })

  // Then generate services for each forecast element in buckets
  // Retrieve generic elements options if any
  const elementServiceOptions = app.getServiceOptions('elements')
  const buckets = _.keys(elementBuckets)
  // Iterate over buckets
  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i]
    const elements = elementBuckets[bucket]
    const elementServices = []
    for (let j = 0; j < elements.length; j++) {
      const element = elements[j]
      debug('Creating service for element ' + element.name)
      const elementService = await app.createElementService(forecast, element, servicesPath,
        Object.assign({}, element.serviceOptions, elementServiceOptions))
      elementServices.push(elementService)
    }
    // Keep track of services
    elementBuckets[bucket] = elementServices
  }

  async function update () {
    // Iterate over buckets
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      // For each bucket launch download tasks in parallel
      await Promise.all(elementBuckets[bucket].map(service => {
        return service.updateForecastData().catch(error => {
          app.logger.error(error.message)
          service.updateRunning = false
        })
      }))
    }
  }

  if (forecast.updateInterval >= 0) {
    // Trigger the initial harvesting, i.e. try data refresh for current time
    // Add a small offset to wait for everything being initialized
    setTimeout(update, 30 * 1000)
    // Then plan next updates according to provided update interval if required
    if (forecast.updateInterval > 0) {
      app.logger.info('Installing forecast update on ' + forecast.name + ' with interval (s) ' + forecast.updateInterval)
      setInterval(update, 1000 * forecast.updateInterval)
    }
  }

  // Process elements with GridFS data store which requires manual cleanup
  const elementsToClean = forecast.elements.filter(element => element.dataStore === 'gridfs')

  async function clean () {
    // Iterate over required elements
    for (let i = 0; i < elementsToClean.length; i++) {
      const service = app.getService(forecast.name + '/' + elementsToClean[i].name)
      // Launch clean task
      try {
        await service.cleanForecastData()
      } catch (error) {
        app.logger.error(error.message)
      }
    }
  }

  if (elementsToClean.length > 0) {
    // Trigger the initial cleanup, i.e. try data cleanup for current time
    // Add a small offset to wait for everything being initialized
    setTimeout(clean, 10 * 1000)
    // Then plan next cleanups according to provided clean interval if required, alternatively with data update
    // Provide a default interval if no updates
    const cleanInterval = (forecast.updateInterval >= 0 ? forecast.updateInterval : 30 * 60)
    if (cleanInterval > 0) {
      setTimeout(() => {
        app.logger.info('Installing forecast cleanup on ' + forecast.name + ' with interval (s) ' + cleanInterval)
        setInterval(clean, 1000 * cleanInterval)
      }, 0.5 * cleanInterval)
    }
  }
}
