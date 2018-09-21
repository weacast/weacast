import logger from 'winston'
import makeDebug from 'debug'
import _ from 'lodash'
import moment from 'moment'
import errors from 'feathers-errors'
import { Grid } from 'weacast-core'

const debug = makeDebug('weacast:weacast-probe')
const uComponentPrefix = 'u-'
const vComponentPrefix = 'v-'

function isDirectionElement(elementName) {
  const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
  const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
  return (isUComponentOfDirection || isVComponentOfDirection)
}

function getElementPrefix(elementName) {
  const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
  const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
  return isUComponentOfDirection ? uComponentPrefix : (isVComponentOfDirection ? vComponentPrefix : '') // e.g. 'u-' for u-wind'
}

function getDirectionElement(elementName) {
  return elementName.replace(getElementPrefix(elementName), '') // e.g. will generate 'wind' for 'u-wind'/'v-wind'
}

export default {

  // Update the given probe results (given as features)
  async updateFeaturesInDatabase (features, probe, elementService, runTime, forecastTime) {
    // Get the service to store results in
    let resultService = this.app.getService('probe-results')
    let probeUpdates = []
    const elementName = elementService.element.name
    const propertyName = 'properties.' + elementName
    const isComponentOfDirection = isDirectionElement(elementName)
    const directionElement = getDirectionElement(elementName) // e.g. will generate 'wind' for 'u-wind'/'v-wind'
    const speedPropertyName = 'properties.' + directionElement + 'Speed'
    const directionPropertyName = 'properties.' + directionElement + 'Direction'
    const bearingPropertyName = 'properties.' + directionElement + 'BearingDirection'
    features.forEach(feature => {
      // Check if something to store for the element
      if (_.has(feature, propertyName)) {
        // Already stored in DB ? If so update else create
        if (feature._id) {
          debug('Updating probe result for probe ' + feature.probeId + ' at ' + feature.forecastTime.format() + ' on run ' + feature.runTime.format())
          // See https://github.com/weacast/weacast-probe/issues/2
          //probeUpdates.push(resultService.update(feature._id, feature))
          let data = { [propertyName]: _.get(feature, propertyName) }
          // Update derived direction values as well in this case
          if (isComponentOfDirection) {
            if (_.has(feature, speedPropertyName)) data[speedPropertyName] = _.get(feature, speedPropertyName)
            if (_.has(feature, directionPropertyName)) data[directionPropertyName] = _.get(feature, directionPropertyName)
            if (_.has(feature, bearingPropertyName)) data[bearingPropertyName] = _.get(feature, bearingPropertyName)
          }
          probeUpdates.push(resultService.patch(feature._id, data))
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
    const elementName = elementService.element.name
    const isComponentOfDirection = isDirectionElement(elementName)
    const directionElement = getDirectionElement(elementName) // e.g. will generate 'wind' for 'u-wind'/'v-wind'
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
        if (isComponentOfDirection) {
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
      const forecastName = service.forecast.name
      const elementName = service.element.name
      // Callback to be called (if not already registered)
      if (!service.hasOwnProperty(refreshCallbackName)) {
        debug('No existing refresh callback for probe ' + probe._id.toString() + ' on element ' + forecastName + '/' + elementName + ', registering')
        // Internal callback
        let refreshCallback = async forecast => {
          // Find probe results associated to this forecast data set
          debug('Looking for existing results with probe ' + probe._id + ' for element ' + forecastName + '/' + elementName +
                ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
          try {
            let features = await this.getResultsForProbe(probe, forecast.forecastTime)
            // Possible on first probing
            if (features.length === 0) {
              let result = await this.get(probe._id, { query: { $select: ['forecast', 'elements', 'features'] } })
              features = result.features
            }
            logger.verbose('Probing forecast data for element ' + forecastName + '/' + elementName + ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
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
        // External callback
        let syncRefreshCallback = async (forecast) => {
          // Need to convert from string to in-memory date objects
          forecast.runTime = moment.utc(forecast.runTime)
          forecast.forecastTime = moment.utc(forecast.forecastTime)
          // In this case we don't already have data in memory so it will be fetched
          await service[refreshCallbackName](forecast)
        }
        
        /* FIXME: see https://github.com/weacast/weacast-probe/issues/2
        // Check if we have to manage a direction composed from two axis components
        const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
        const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
        // Indeed in this case we must ensure probing is done in sequence
        if (isUComponentOfDirection || isVComponentOfDirection) {
          const dualElementName = isUComponentOfDirection ?
            elementName.replace(uComponentPrefix, vComponentPrefix) : // e.g. will generate 'v-wind' for 'u-wind'
            elementName.replace(vComponentPrefix, uComponentPrefix) // e.g. will generate 'u-wind' for 'v-wind'
          // Check if other component callback has been registered
          let dualService = services.find(service => service.element.name === dualElementName)
          // If not yet register proceed with the callback as usual, we will update it with the dual component
          if (dualService) {
            debug('Updating refresh callbacks on direction element ' + forecastName + '/' + elementName)
            // Unregister callback on first component as processign will be performed by second one
            dualService.off('created', dualService[refreshCallbackName])
            refreshCallback = async forecast => {
              // TODO
            }
          }
        }
        */
        // Register for forecast data updates when using internal event systems
        service[refreshCallbackName] = refreshCallback
        service.on('created', service[refreshCallbackName])
        // Or external loaders if any
        if (app.sync) {
          app.sync.on(forecastName + '-' + elementName, syncRefreshCallback)
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
