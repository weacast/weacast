import path from 'path'
import fs from 'fs-extra'
// import logger from 'winston'
// import makeDebug from 'debug'
import moment from 'moment'
import _ from 'lodash'
import errors from 'feathers-errors'
import { Grid } from 'weacast-core'

// const debug = makeDebug('weacast:weacast-probe')

export default {

  async updateFeatures(features, probeId, elementService, resultService, runTime, forecastTime, data) {
    let grid = new Grid({
      bounds: elementService.forecast.bounds,
      origin: elementService.forecast.origin,
      size: elementService.forecast.size,
      resolution: elementService.forecast.resolution,
      data: data
    })

    let probeUpdates = []
    features.forEach(feature => {
      feature.runTime = runTime
      feature.forecastTime = forecastTime
      feature.probeId = probeId
      // Store interpolated element value
      feature.properties[elementService.element.name] = grid.interpolate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
      // Already stored in DB ? If so update else create
      if (feature._id) {
        probeUpdates.push(resultService.update(feature._id, feature))
      }
      else {
        probeUpdates.push(resultService.create(feature))
      }
    })
    // Run DB updates
    return await Promise.all(probeUpdates)
  },

  async probeForecastTime (features, probeId, elementService, runTime, forecastTime, data) {
    // Get the service to store results in
    let resultService = this.app.getService('probe-results')
    // Retrieve forecast data if required
    let forecastData = data
    if (!forecastData) {
      let response = await elementService.find({
        query: {
          forecastTime: forecastTime,
          $select: ['data']
        }
      })
      forecastData = response.data[0].data
    }
    // Find probe results associated to this forecast data set if required
    let probeFeatures = features
    if (!probeFeatures || probeFeatures.length === 0) {
      let response = await resultService.find({
        paginate: false,
        query: {
          forecastTime: forecastTime,
          probeId: probeId
        }
      })
      probeFeatures = response
    }
    return await this.updateFeatures(probeFeatures, probeId, elementService, resultService, runTime, forecastTime, forecastData)
  },

  async probe (layer) {
    if (!layer || !layer.type || layer.type !== 'FeatureCollection') {
      return Promise.reject(new errors.BadRequest('Only GeoJSON FeatureCollection layers are supported'))
    }
    if (!layer.elements || layer.elements.length === 0) {
      return Promise.reject(new errors.BadRequest('Target forecast element not specified'))
    }
    // Retrieve target elements for all models or specified one
    let services = this.app.getElementServices(layer.forecast)
    services = services.filter(service => {
      return layer.elements.reduce((contains, element) => contains || service.name.includes(element), false)
    })
    // Then setup all probes
    let probes = []
    services.forEach((service, index) => {
      // Get all available forecast times or selected one
      let options = {
        paginate: false
      }
      if (layer.time) {
        options.query = {
          time: layer.time
        }
      }
      probes.push(
        service.find(options)
        .then(async response => {
          // For each forecast time of the first service we perform a computation that lead to new result points
          // because we have one point per forecast time, so start from a copy of the features so that we can modify it safely
          // Then starting from the second service we have to update the previous results with the other element values
          let features = (index === 0 ? _.cloneDeep(layer.features) : [])
          // WARNING : Can't use forEach with async otherwise when the loop finishes async calls are not done,
          // we need async iterators https://jakearchibald.com/2017/async-iterators-and-generators/
          for (let forecast of response) {
            await this.probeForecastTime(features, layer._id, service, forecast.runTime, forecast.forecastTime)
          }
        })
      )
      // Register for forecast data update
      service.on('created', forecast => {
        // Ask to retrieve previous results
        this.probeForecastTime([], layer._id, service, forecast.runTime, forecast.forecastTime, forecast.data)
      })
    })
    // Run probing
    await Promise.all(probes)
  }
}
