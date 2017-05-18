import path from 'path'
import fs from 'fs-extra'
// import logger from 'winston'
// import makeDebug from 'debug'
import moment from 'moment'
import errors from 'feathers-errors'
import { Grid } from 'weacast-core'

// const debug = makeDebug('weacast:weacast-probe')

export default {

  updateLayer(layer, service, runTime, forecastTime, data) {
    layer.runTime = runTime
    layer.forecastTime = forecastTime

    let grid = new Grid({
      bounds: service.forecast.bounds,
      origin: service.forecast.origin,
      size: service.forecast.size,
      resolution: service.forecast.resolution,
      data: data
    })

    layer.features.forEach(feature => {
      // Store interpolated element value
      feature.properties[service.element.name] = grid.interpolate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
    })
  },

  async probeForecastTime (layer, service, runTime, forecastTime, data) {
    // Get the service to store results in
    let resultService = this.app.getService('probe-results')
    // Retrieve forecast data if required
    if (!data) {
      let response = await service.find({
        query: {
          forecastTime: forecastTime,
          $select: ['data']
        }
      })
      data = response.data[0].data
    }
    // Find probe result associated to this forecast data set
    let result = await resultService.find({
      query: {
        $select: ['_id', 'runTime', 'forecastTime'], // We only need object ID
        forecastTime: forecastTime,
        probeId: layer.probeId
      }
    })
    let previousResult = (result.data.length > 0 ? result.data[0] : null)
    if (previousResult) {
      this.updateLayer(previousResult, service, runTime, forecastTime, data)
      await resultService.update(previousResult._id, previousResult)
    }
    else {
      this.updateLayer(layer, service, runTime, forecastTime, data)
      await resultService.create(layer)
    }
  },

  async probe (layer) {
    if (!layer || !layer.type || layer.type !== 'FeatureCollection') {
      return Promise.reject(new errors.BadRequest('Only GeoJSON FeatureCollection layers are supported'))
    }
    if (!layer.elements || layer.elements.length === 0) {
      return Promise.reject(new errors.BadRequest('Target forecast element not specified'))
    }
    // Because we serialize the same layer object for results
    let _id = layer._id
    delete layer._id
    layer.probeId = _id
    // Retrieve target elements for all models or specified one
    let services = this.app.getElementServices(layer.forecast)
    services = services.filter(service => {
      return layer.elements.reduce((contains, element) => contains || service.name.includes(element), false)
    })
    // Then setup all probes
    let probes = []
    services.forEach(service => {
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
          // For each forecast time perform computation
          // WARNING : Can't use forEach with async otherwise when the loop finishes async calls are not done,
          // we need async iterators https://jakearchibald.com/2017/async-iterators-and-generators/
          for (let forecast of response) {
            await this.probeForecastTime(layer, service, forecast.runTime, forecast.forecastTime)
          }
        })
      )
      // Register for forecast data update
      service.on('created', forecast => {
        this.probeForecastTime(layer, service, forecast.runTime, forecast.forecastTime, forecast.data)
      })
    })
    // Run probing
    await Promise.all(probes)
    layer._id = _id
    delete layer.probeId
  }
}
