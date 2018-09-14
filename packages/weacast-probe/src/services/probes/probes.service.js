import logger from 'winston'
import makeDebug from 'debug'
import _ from 'lodash'
import moment from 'moment'
import errors from 'feathers-errors'
import { Grid } from 'weacast-core'

const debug = makeDebug('weacast:weacast-probe')

export default {

  // Update the given probe results (given as features)
  async updateFeaturesInDatabase (features, probe, elementService, runTime, forecastTime) {
    // Get the service to store results in
    let resultService = this.app.getService('probe-results')
    let probeUpdates = []
    features.forEach(feature => {
      // Check if something to store for the element
      if (feature.properties.hasOwnProperty(elementService.element.name)) {
        // Already stored in DB ? If so update else create
        if (feature._id) {
          debug('Updating probe result for probe ' + feature.probeId + ' at ' + feature.forecastTime.format() + ' on run ' + feature.runTime.format())
          probeUpdates.push(resultService.update(feature._id, feature))
        } else {
          debug('Creating probe result for probe ' + feature.probeId + ' at ' + feature.forecastTime.format() + ' on run ' + feature.runTime.format())
          probeUpdates.push(resultService.create(feature))
        }
        debug(feature)
      }
    })
    // Run DB updates
    let results = await Promise.all(probeUpdates)

    logger.verbose('Produced ' + results.length + ' results for probe ' + probe._id + ' on element ' + elementService.forecast.name + '/' + elementService.element.name +
                ' at ' + forecastTime.format() + ' for run ' + runTime.format())

    return results
  },

  // Update the given features, for given probe, with interpolated values according to given forecast data, run/forecast time
  async updateFeatures (features, probe, elementService, runTime, forecastTime, data) {
    let grid = new Grid({
      bounds: elementService.forecast.bounds,
      origin: elementService.forecast.origin,
      size: elementService.forecast.size,
      resolution: elementService.forecast.resolution,
      data: data
    })

    // Check if we have to manage a direction composed from two axis components
    const uComponentPrefix = 'u-'
    const vComponentPrefix = 'v-'
    const elementName = elementService.element.name
    const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
    const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
    const elementPrefix = isUComponentOfDirection ? uComponentPrefix : (isVComponentOfDirection ? vComponentPrefix : '') // e.g. 'u-' for u-wind'
    const directionElement = elementName.replace(elementPrefix, '') // e.g. will generate 'wind' for 'u-wind'/'v-wind'
    // Check if a bearing property is given to compute direction relatively to
    const bearingProperty = directionElement + 'BearingProperty'
    const bearingPropertyName = probe.hasOwnProperty(bearingProperty) ? probe[bearingProperty] : undefined

    features.forEach(feature => {
      feature.runTime = runTime
      feature.forecastTime = forecastTime
      feature.probeId = probe._id
      let value = grid.interpolate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
      if (value) { // Prevent values outside grid bbox
        if (!feature.properties) { // Take care to initialize properties holder if not given in input feature
          feature.properties = {}
        }
        // Store interpolated element value
        feature.properties[elementName] = value
        // Update derived direction values as well in this case
        if (isUComponentOfDirection || isVComponentOfDirection) {
          const u = feature.properties[uComponentPrefix + directionElement]
          const v = feature.properties[vComponentPrefix + directionElement]
          // Only possible if both elements are already computed
          if (isFinite(u) && isFinite(v)) {
            // Compute direction expressed in meteorological convention, i.e. angle from which the flow comes
            let norm = Math.sqrt(u * u + v * v)
            let direction = 180.0 + Math.atan2(u, v) * 180.0 / Math.PI
            // Then store it
            feature.properties[directionElement + 'Speed'] = norm
            feature.properties[directionElement + 'Direction'] = direction
            // Compute bearing relatively to a bearing property if given
            if (bearingPropertyName) {
              let bearing = _.toNumber(feature.properties[bearingPropertyName])
              if (isFinite(bearing)) {
                // Take care that bearing uses the geographical convention, i.e. angle toward which the element goes,
                // we need to convert from meteorological convention, i.e. angle from which the flow comes
                direction += 180
                if (direction >= 360) direction -= 360
                direction -= bearing
                if (direction < 0) direction += 360
                feature.properties[directionElement + 'BearingDirection'] = direction
              }
            }
          }
        }
      }
    })
  },

  // Update the given features, for given probe, with interpolated values according to given forecast data, run/forecast time
  // If forecast data are not given they are retrieved from the existing data in DB
  async probeForecastTime (features, probe, elementService, runTime, forecastTime, data) {
    // Retrieve forecast data if required
    let forecastData = data
    if (!forecastData) {
      debug('No forecast data provided for probe ' + probe._id + ' on element ' + elementService.forecast.name + '/' + elementService.element.name +
            ' at ' + forecastTime.format() + ' on run ' + runTime.format() + ', looking for existing ones')
      let response = await elementService.find({
        query: {
          forecastTime: forecastTime,
          $select: ['data']
        }
      })
      forecastData = (response.data.length > 0 ? response.data[0].data : null)
    }

    if (!forecastData) {
      throw new Error('Cannot retrieve forecast data for probe ' + probe._id + ' on element ' + elementService.forecast.name + '/' + elementService.element.name +
                ' at ' + forecastTime.format() + ' for run ' + runTime.format())
    }

    this.updateFeatures(features, probe, elementService, runTime, forecastTime, forecastData)
  },

  async getResultsForProbe (probe, forecastTime) {
    // Get the service to read results in
    let resultService = this.app.getService('probe-results')
    let results = await resultService.find({
      paginate: false,
      query: {
        forecastTime: forecastTime,
        probeId: probe._id
      }
    })
    return results
  },

  // Retrieve all element services required to update the given probe
  getElementServicesForProbe (probe) {
    // Retrieve target elements for all models or specified one
    let services = this.app.getElementServices(probe.forecast)
    services = services.filter(service => {
      return probe.elements.reduce((contains, element) => contains || service.name.includes(element), false)
    })
    return services
  },

  getRefreshCallbackName (probe) {
    return 'refresh_probe_' + probe._id.toString()
  },

  // Register to updates on all element services required to update the given probe
  registerForecastUpdates (probe) {
    const refreshCallbackName = this.getRefreshCallbackName(probe)
    // Retrieve target elements
    let services = this.getElementServicesForProbe(probe)
    services.forEach(service => {
      const app = service.app
      // Callback to be called (if not already registered)
      if (!service.hasOwnProperty(refreshCallbackName)) {
        debug('No existing refresh callback for probe ' + probe._id.toString() + ' on element ' + service.forecast.name + '/' + service.element.name + ', registering')
        service[refreshCallbackName] = async forecast => {
          // Find probe results associated to this forecast data set
          debug('Looking for existing results with probe ' + probe._id + ' for element ' + service.forecast.name + '/' + service.element.name +
                ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
          try {
            let features = await this.getResultsForProbe(probe, forecast.forecastTime)
            // Possible on first probing
            if (features.length === 0) {
              let result = await this.get(probe._id, { query: { $select: ['forecast', 'elements', 'features'] } })
              features = result.features
            }
            logger.verbose('Probing forecast data for element ' + service.forecast.name + '/' + service.element.name + ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
            await this.probeForecastTime(features, probe, service, forecast.runTime, forecast.forecastTime, forecast.data)
            await this.updateFeaturesInDatabase(features, probe, service, forecast.runTime, forecast.forecastTime)
            // Send a message so that clients know there are new results, indeed for performance reasons standard events have been disabled on results
            // Take care to not forward forecast data
            delete forecast.data
            this.emit('results', { probe, forecast })
          } catch (error) {
            logger.error(error.message)
          }
        }
        // Register for forecast data updates
        // When using internal event systems
        service.on('created', service[refreshCallbackName])
        // Or external loaders if any
        if (app.sync) {
          app.sync.on(service.forecast.name + '-' + service.element.name, (forecast) => {
            // Need to convert from string to in-memory date objects
            forecast.runTime = moment.utc(forecast.runTime)
            forecast.forecastTime = moment.utc(forecast.forecastTime)
            // In this case we don't already have data in memory so it will be fetched
            service[refreshCallbackName](forecast)
          })
        }
      }
    })
  },

  // Unregister from updates on all element services required to update the given probe
  unregisterForecastUpdates (probe) {
    const refreshCallbackName = this.getRefreshCallbackName(probe)
    // Retrieve target elements
    let services = this.getElementServicesForProbe(probe)
    services.forEach(service => {
      // Unregister for forecast data update
      debug('Removing existing refresh callback for probe ' + probe._id.toString() + ' on element ' + service.forecast.name + '/' + service.element.name + ', registering')
      service.removeListener('created', service[refreshCallbackName])
    })
  },

  // Perform probing on the input features if any (on-demand probe), in this case the probing time must be given
  // Otherwise features are retrieved from the existing probe in DB, probing performed for each available forecast time and result features updated back in DB (probing stream)
  // This also registers the probe to perform updates on results when new forecast data are coming
  async probe (probe, forecastTime) {
    if (!probe || !probe.type || probe.type !== 'FeatureCollection') {
      throw new errors.BadRequest('Only GeoJSON FeatureCollection layers are supported to create probes')
    }
    if (!probe.forecast) {
      throw new errors.BadRequest('Target forecast model not specified')
    }
    if (!probe.elements || probe.elements.length === 0) {
      throw new errors.BadRequest('Target forecast element(s) not specified')
    }
    // Retrieve target elements
    let services = this.getElementServicesForProbe(probe)
    // Then run all probes
    try {
      for (let service of services) {
        // Get all available forecast times (probing stream) or selected one (on-demand probe)
        let options = {
          paginate: false
        }
        if (forecastTime) {
          options.query = {
            forecastTime: forecastTime
          }
        }

        let forecasts = await service.find(options)
        for (let forecast of forecasts) {
          let features = []
          // Retrieve previously stored features to perform update if any when streaming
          if (!forecastTime) {
            features = await this.getResultsForProbe(probe, forecast.forecastTime)
          }
          // Otherwise this means we have to create new ones starting from given template collection
          // First probing for streaming or always on-demand
          if (features.length === 0) {
            features = probe.features
          }
          // Ask to retrieve forecast data and perform probing
          await this.probeForecastTime(features, probe, service, forecast.runTime, forecast.forecastTime)
          // When performing probing on-demand we do not store any result,
          // the returned features contain the probe values
          if (!forecastTime) {
            await this.updateFeaturesInDatabase(features, probe, service, forecast.runTime, forecast.forecastTime)
            // Send a message so that clients know there are new results, indeed for performance reasons standard events have been disabled on results
            this.emit('results', { probe, forecast })
          }
        }
      }
    } catch (error) {
      logger.error(error.message)
    }

    // Register for forecast data updates on probing streams
    if (!forecastTime) {
      this.registerForecastUpdates(probe)
    }
  }
}
