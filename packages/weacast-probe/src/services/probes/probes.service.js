import logger from 'winston'
import makeDebug from 'debug'
import _ from 'lodash'
import dot from 'dot-object'
import moment from 'moment'
import errors from '@feathersjs/errors'
import { Grid } from 'weacast-core'

const debug = makeDebug('weacast:weacast-probe:service')
const debugResults = makeDebug('weacast:weacast-probe:results')
const uComponentPrefix = 'u-'
const vComponentPrefix = 'v-'

function isDirectionElement (elementName) {
  const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
  const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
  return (isUComponentOfDirection || isVComponentOfDirection)
}

function getElementPrefix (elementName) {
  const isUComponentOfDirection = elementName.startsWith(uComponentPrefix) // e.g. 'u-wind'
  const isVComponentOfDirection = elementName.startsWith(vComponentPrefix) // e.g. 'v-wind'
  return isUComponentOfDirection ? uComponentPrefix : (isVComponentOfDirection ? vComponentPrefix : '') // e.g. 'u-' for u-wind'
}

function getElementSuffix (elementName) {
  // e.g. will generate 'wind-1000' for 'u-wind-1000'/'v-wind-1000'
  const suffix = elementName.replace(getElementPrefix(elementName), '')
  const index = suffix.indexOf('-')
  // e.g. will generate '-1000' for 'wind-1000'
  return (index >= 0 ? suffix.substring(index) : '')
}

function getDirectionElement (elementName) {
  // e.g. will generate 'wind' for 'u-wind'/'v-wind' or 'u-wind-1000'/'v-wind-1000'
  return elementName.replace(getElementPrefix(elementName), '').replace(getElementSuffix(elementName), '')
}

export default {

  // Update the given probe results (given as features)
  async updateFeaturesInDatabase (features, probe, elementService, forecast) {
    const { runTime, forecastTime } = forecast
    // Get the service to store results in
    let resultService = this.app.getService('probe-results')
    let operations = []
    const elementName = elementService.element.name
    const propertyName = 'properties.' + elementName
    const isComponentOfDirection = isDirectionElement(elementName)
    const directionElement = getDirectionElement(elementName) // e.g. will generate 'wind' for 'u-wind'/'v-wind'
    const suffix = getElementSuffix(elementName) // e.g. will generate '-1000' for 'u-wind-1000'/'v-wind-1000'
    // e.g. will generate '-1000' for 'u-wind-1000'/'v-wind-1000'
    const speedPropertyName = 'properties.' + directionElement + 'Speed' + suffix
    const directionPropertyName = 'properties.' + directionElement + 'Direction' + suffix
    const bearingPropertyName = 'properties.' + directionElement + 'BearingDirection' + suffix
    // We don't use service level operations like update to avoid concurrency issues,
    // eg see https://github.com/weacast/weacast-probe/issues/2.
    // We also want good performances so we use a bulkWrite
    for (let i = 0; i < features.length; i++) {
      const feature = features[i]
      // Check if something to store for the element
      if (_.has(feature, propertyName)) {
        let data = {
          [propertyName]: _.get(feature, propertyName)
          // Because we will not go through service hooks in this case we have to format dates to basic object types manually
          runTime: new Date(runTime.format()),
        }
        // Update derived direction values as well in this case
        if (isComponentOfDirection) {
          if (_.has(feature, speedPropertyName)) data[speedPropertyName] = _.get(feature, speedPropertyName)
          if (_.has(feature, directionPropertyName)) data[directionPropertyName] = _.get(feature, directionPropertyName)
          if (_.has(feature, bearingPropertyName)) data[bearingPropertyName] = _.get(feature, bearingPropertyName)
        }

        // Already stored in DB ?
        if (feature._id) {
          debugResults('Updating probe result for probe ' + feature.probeId + ' at ' + forecastTime.format() +
                       ' on run ' + runTime,.format(), feature)
          // Call service hooks (DB update is skipped when bulk param is used)
          await resultService.update(feature._id, data, { bulk: true })
          // Create bulk operation for update
          operations.push({
            updateOne: {
              filter: { _id: feature._id }, // In this case we query by ID for update
              update: { $set: data } // and indicate we'd like to patch some fields
            }
          })
        } else {
          debugResults('Inserting probe result for probe ' + probe._id + ' at ' + forecastTime.format() +
                       ' on run ' + runTime.format(), feature)
          // The base feature to insert is the one without the computed elements
          let baseFeature = _.omit(feature, Object.keys(data))
          // Because we will not go through service hooks in this case we have to format dates to basic object types manually
          Object.assign(baseFeature, {
            runTime: new Date(runTime.format()),
            forecastTime: new Date(forecastTime.format())
          })
          // MongoDB requires the dot notation here so we perform conversion
          // Take care that ObjectIDs are not basic types so we remove it before
          delete baseFeature.probeId
          // The same for coordinates array
          _.unset(baseFeature, 'geometry.coordinates')
          baseFeature = dot.dot(baseFeature)
          // And add it back after conversion
          baseFeature.probeId = probe._id
          baseFeature['geometry.coordinates'] = _.get(feature, 'geometry.coordinates')
          // Create bulk operation for insert or update
          let filter = { // In this case we query by forecastTime/runTime/probeId
            runTime: new Date(runTime.format()),
            forecastTime: new Date(forecastTime.format()),
            probeId: probe._id
          }
          // And by feature unique ID, unify as array because unique Id can be obtained by combining multiple properties
          let ids = probe.featureId
          if (!Array.isArray(ids)) {
            ids = [ids]
          }
          ids.forEach(id => {
            filter[id] = _.get(feature, id)
          })
          // Call service hooks (DB update is skipped when bulk param is used)
          await resultService.create(data, { bulk: true })
          operations.push({
            updateOne: {
              filter,
              upsert: true, // and indicate we'd like to create it if it does not already exist
              update: {
                $set: data, // and indicate we'd like to patch some fields if the probe already exists
                $setOnInsert: baseFeature // and indicate we will use the whole feature data on creation
              }
            }
          })
        }
      }
    }
    // Run DB updates
    try {
      let response = await resultService.Model.bulkWrite(operations)

      logger.verbose(`Produced ${response.upsertedCount + response.modifiedCount} results (${response.upsertedCount} creates - ${response.modifiedCount} updates)
                      for probe ${probe._id} on element ${elementService.forecast.name + '/' + elementService.element.name}
                      at ${forecastTime.format()} for run ${runTime.format()}`)

      if (response.hasWriteErrors()) response.getWriteErrors().forEach(error => console.log(error))
      return features
    } catch (error) {
      console.log(error)
      return []
    }
  },

  pushTime (feature, timeName, elementName, time, value) {
    // For each element we store the list of available times
    const times = _.get(feature, timeName + '.' + elementName)
    // Initialize
    if (!times) _.set(feature, timeName + '.' + elementName, [time.format()])
    else times.push(time.format())
    // And we store associated value using a map to avoid any operation order-dependence
    if (!_.isNil(value)) _.set(feature.properties, elementName + '.' + time.format(), value)
  },

  getValueAtTime (feature, elementName, time) {
    return _.get(feature.properties, elementName + '.' + (moment.isMoment(time) ? time.format() : time))
  },

  // Update the given features, for given probe, with interpolated values according to given forecast grid, run/forecast time
  async updateFeatures (features, probe, elementService, forecast) {
    const { runTime, forecastTime, grid } = forecast

    // Check if we have to manage a direction composed from two axis components
    const elementName = elementService.element.name
    const isComponentOfDirection = isDirectionElement(elementName)
    const directionElement = getDirectionElement(elementName) // e.g. will generate 'wind' for 'u-wind'/'v-wind'
    const suffix = getElementSuffix(elementName) // e.g. will generate '-1000' for 'u-wind-1000'/'v-wind-1000'
    // e.g. will generate '-1000' for 'u-wind-1000'/'v-wind-1000'
    const speedProperty = directionElement + 'Speed' + suffix
    const directionProperty = directionElement + 'Direction' + suffix
    // Check if a bearing property is given to compute direction relatively to
    const bearingProperty = directionElement + 'BearingProperty'
    const bearingPropertyName = probe.hasOwnProperty(bearingProperty) ? probe[bearingProperty] : undefined
    const bearingDirectionProperty = directionElement + 'BearingDirection' + suffix

    features.forEach(feature => {
      // Check if we process on-demand probing for a time range
      const isTimeRange = (feature.forecastTime && !moment.isMoment(feature.forecastTime))
      if (probe._id) feature.probeId = probe._id
      let value = grid.interpolate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
      if (!_.isNil(value) && isFinite(value)) { // Prevent values outside grid bbox
        // Store interpolated element value
        if (isTimeRange) {
          this.pushTime(feature, 'forecastTime', elementName, forecastTime, value)
          this.pushTime(feature, 'runTime', elementName, runTime)
        } else {
          feature.forecastTime = forecastTime
          feature.runTime = runTime
          feature.properties[elementName] = value
        }
        // Update derived direction values as well in this case
        if (isComponentOfDirection) {
          let u, v
          if (isTimeRange) {
            u = this.getValueAtTime(feature, uComponentPrefix + directionElement + suffix, forecastTime)
            v = this.getValueAtTime(feature, vComponentPrefix + directionElement + suffix, forecastTime)
          } else {
            u = feature.properties[uComponentPrefix + directionElement + suffix]
            v = feature.properties[vComponentPrefix + directionElement + suffix]
          }
          // Only possible if both elements are already computed
          if (!_.isNil(u) && !_.isNil(v) && isFinite(u) && isFinite(v)) {
            // Compute direction expressed in meteorological convention, i.e. angle from which the flow comes
            let norm = Math.sqrt(u * u + v * v)
            let direction = 180.0 + Math.atan2(u, v) * 180.0 / Math.PI
            // Then store it
            // Check if we process on-demand probing for a time range
            if (isTimeRange) {
              this.pushTime(feature, 'forecastTime', speedProperty, forecastTime, norm)
              this.pushTime(feature, 'runTime', speedProperty, runTime)
              this.pushTime(feature, 'forecastTime', directionProperty, forecastTime, direction)
              this.pushTime(feature, 'runTime', directionProperty, runTime)
            } else {
              // Forecast/run time already set on feature for previous element values
              feature.properties[speedProperty] = norm
              feature.properties[directionProperty] = direction
            }
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
                // Then store it
                if (isTimeRange) {
                  this.pushTime(feature, 'forecastTime', bearingDirectionProperty, forecastTime, direction)
                  this.pushTime(feature, 'runTime', bearingDirectionProperty, runTime)
                } else {
                  // Forecast/run time already set on feature for previous element values
                  feature.properties[bearingDirectionProperty] = direction
                }
              }
            }
          }
        }
      }
    })
  },

  // Update the given features, for given probe, with interpolated values according to given forecast data, run/forecast time
  // If forecast data are not given they are retrieved from the existing data in DB
  async probeForecastTime (features, probe, elementService, forecast) {
    const { _id, x, y, runTime, forecastTime, data } = forecast
    // Retrieve forecast data if required
    let forecastData = data
    if (!forecastData) {
      let query = {
        $select: ['data']
      }
      debug('No forecast data provided for probe ' + (probe._id ? probe._id : 'on-demand') + ' on element ' + elementService.forecast.name + '/' + elementService.element.name +
            ' at ' + forecastTime.format() + ' on run ' + runTime.format() + ', querying existing one', query)
      // If we have an ID we will use it, otherwise request by forecast time
      if (_id) {
        let response = await elementService.get(_id.toString(), { query })
        forecastData = response.data
      } else {
        query.forecastTime = forecastTime
        if (elementService.forecast.keepPastRuns || elementService.element.keepPastRuns) {
          query.runTime = forecast.runTime
        }
        // Take care that we need tile ID for tiles
        if (!_.isNil(x) && !_.isNil(y)) {
          Object.assign(query, {
            x,
            y,
            timeseries: false // Probe single time not timeseries
          })
        }
        let response = await elementService.find({ query })
        forecastData = (response.data.length > 0 ? response.data[0].data : null)
      }
    }

    if (!forecastData) {
      throw new Error('Cannot retrieve forecast data for probe ' + (probe._id ? probe._id : 'on-demand') + ' on element ' + elementService.forecast.name + '/' + elementService.element.name +
                ' at ' + forecastTime.format() + ' for run ' + runTime.format())
    }
    // Check if we process a tile or raw data
    let grid
    if (!_.isNil(x) && !_.isNil(y)) {
      grid = new Grid({
        bounds: forecast.bounds,
        origin: forecast.origin,
        size: forecast.size,
        resolution: forecast.resolution,
        data: forecastData
      })
    } else {
      grid = new Grid({
        bounds: elementService.forecast.bounds,
        origin: elementService.forecast.origin,
        size: elementService.forecast.size,
        resolution: elementService.forecast.resolution,
        data: forecastData
      })
    }
    this.updateFeatures(features, probe, elementService, { runTime, forecastTime, grid })
  },

  async getResultsForProbe (probe, elementService, forecast) {
    // Get the service to read results in
    let resultService = this.app.getService('probe-results')
    let query: {
      forecastTime: forecast.forecastTime,
      probeId: probe._id
    }
    if (elementService.forecast.keepPastRuns || elementService.element.keepPastRuns) {
      query.runTime = forecast.runTime
    }
    let results = await resultService.find({
      paginate: false,
      query
    })
    return results
  },

  // Retrieve all element services required to update the given probe
  getElementServicesForProbe (probe) {
    // Retrieve target elements for all models or specified one
    let services = this.app.getElementServices(probe.forecast)
    services = services.filter(service => {
      return probe.elements.reduce((contains, element) => contains || (service.name === probe.forecast + '/' + element), false)
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
          // Do not process tiles but only raw data
          if (forecast.geometry) return
          // Find probe results associated to this forecast data set
          debug('Looking for existing results with probe ' + probe._id + ' for element ' + forecastName + '/' + elementName +
                ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
          try {
            let features = await this.getResultsForProbe(probe, service, forecast)
            // Possible on first probing
            if (features.length === 0) {
              let result = await this.get(probe._id, { query: { $select: ['forecast', 'elements', 'features'] } })
              features = result.features
            }
            logger.verbose('Probing forecast data for element ' + forecastName + '/' + elementName + ' at ' + forecast.forecastTime.format() + ' on run ' + forecast.runTime.format())
            await this.probeForecastTime(features, probe, service, forecast)
            await this.updateFeaturesInDatabase(features, probe, service, forecast)
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

  // Perform probing on the input features if any (on-demand probe), in this case the probing time(s) must be given
  // Otherwise features are retrieved from the existing probe in DB, probing performed for each available forecast time,
  // and result features updated back in DB (probing stream)
  // This also registers the probe to perform updates on results when new forecast data are coming
  async probe (probe, query = {}) {
    const forecastTime = query.forecastTime
    const isTimeRange = (forecastTime && (forecastTime.$lt || forecastTime.$lte || forecastTime.$gt || forecastTime.$gte))
    const aggregate = _.get(query, 'aggregate', true)
    const geometry = _.get(query, 'geometry.$geoIntersects.$geometry')
    // If querying at a specific location automatically generate the GeoJSON feature
    if (geometry) {
      Object.assign(probe, {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry
        }]
      })
    }
    if (!probe.type || probe.type !== 'FeatureCollection') {
      throw new errors.BadRequest('Only GeoJSON FeatureCollection layers are supported to create probes')
    }
    if (!probe.forecast) {
      throw new errors.BadRequest('Target forecast model not specified')
    }
    if (!probe.elements || probe.elements.length === 0) {
      throw new errors.BadRequest('Target forecast element(s) not specified')
    }
    // Probe streaming request a unique feature ID
    if (!forecastTime && !probe.featureId) {
      throw new errors.BadRequest('Unique identifier for probe features not specified')
    }

    // Register for forecast data updates on probing streams
    if (!forecastTime) {
      this.registerForecastUpdates(probe)
    } else {
      // Retrieve target elements
      let services = this.getElementServicesForProbe(probe)
      debug('Probing following services for on-demand probe', services.map(service => service.name))
      // When probing a location we use tiles, take care to use only single time tiles not aggregated if any
      let forecastQuery = (geometry ? { timeseries: false } : {})
      Object.assign(forecastQuery, _.omit(query, ['aggregate']))
      debug('Probing query', forecastQuery)
      // Then run all probes
      try {
        // Initialize features data
        let features = probe.features
        features.forEach(feature => {
          // If we have a time range for on-demand probing tag features using an array
          if (isTimeRange && !feature.forecastTime) feature.forecastTime = {}
          // Take care to initialize properties holder if not given in input feature
          if (!feature.properties) feature.properties = {}
        })
        for (let service of services) {
          // Will get all available forecast times (probing stream) or selected one(s) (on-demand probe)
          let forecasts = await service.find({ paginate: false, query: forecastQuery })
          debug('Probing following forecasts for probe ' + (probe._id ? probe._id : 'on-demand '), forecasts)
          for (let forecast of forecasts) {
            // Ask to retrieve forecast data and perform probing
            await this.probeForecastTime(features, probe, service, forecast)
          }
        }
      } catch (error) {
        logger.error(error.message)
      }
    }

    if (forecastTime && isTimeRange) {
      // If we do not aggregate and generate a separated feature per time
      let features = {}
      // Rearrange data so that we get ordered arrays indexed by element instead of maps
      probe.features.forEach(feature => {
        // Split data according to time if required
        if (!aggregate) {
          _.forOwn(feature.forecastTime, (times, element) => {
            times.forEach((time, index) => {
              const featureId = (Array.isArray(probe.featureId)
                ? probe.featureId.map(id => _.get(feature, id)).join('-')
                : _.get(feature, probe.featureId))
              let featuresForId = features[featureId]
              let featureForTime
              if (featuresForId) featureForTime = featuresForId[time]
              if (!featureForTime) {
                featureForTime = Object.assign({}, _.pick(feature, ['type', 'geometry']))
                featureForTime.forecastTime = moment.utc(time)
                featureForTime.runTime = moment.utc(feature.runTime[element][index])
                featureForTime.properties = _.omit(feature.properties, probe.elements)
                if (featuresForId) features[featureId][time] = featureForTime
                else features[featureId] = { [time]: featureForTime }
              }
              featureForTime.properties[element] = this.getValueAtTime(feature, element, time)
            })
          })
        } else {
          // Create the arrays of ordered times
          feature.forecastTime = _.mapValues(feature.forecastTime,
            (times, element) => times.map(time => moment.utc(time)).sort((a, b) => a - b))
          feature.runTime = _.mapValues(feature.runTime,
            (times, element) => times.map(time => moment.utc(time)).sort((a, b) => a - b))
          // Then build the associated array of interpolated values
          let properties = {}
          _.forOwn(feature.forecastTime, (times, element) => {
            properties[element] = []
            times.forEach(time => properties[element].push(this.getValueAtTime(feature, element, time)))
          })
          // Update feature
          Object.assign(feature.properties, properties)
        }
      })
      // If we do not aggregate update output with a separated feature per time
      if (!aggregate) {
        probe.features = []
        _.forOwn(features, (times, id) => {
          probe.features = probe.features.concat(_.values(times).sort((a, b) => a.forecastTime - b.forecastTime))
        })
      }
    }
  }
}
