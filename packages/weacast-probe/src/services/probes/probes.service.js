import path from 'path'
import fs from 'fs-extra'
// import logger from 'winston'
// import makeDebug from 'debug'
import moment from 'moment'
import errors from 'feathers-errors'
import { Grid } from 'weacast-core'

// const debug = makeDebug('weacast:weacast-probe')

export default {

  async probeForecastTime (layer, service, forecastTime) {
    let response = await service.find({
      query: {
        forecastTime: new Date(forecastTime.format()),
        $select: ['data']
      }
    })

    let grid = new Grid({
      bounds: service.forecast.bounds,
      origin: service.forecast.origin,
      size: service.forecast.size,
      resolution: service.forecast.resolution,
      data: response.data[0].data
    })

    layer.features.forEach(feature => {
      // Create element data holder on first value
      if (!feature.properties[service.name]) {
        feature.properties[service.name] = {}
      }
      feature.properties[service.name][forecastTime.format()] = grid.interpolate(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
    })
  },

  async probe (layer) {
    if (!layer || !layer.type || layer.type !== 'FeatureCollection') {
      return Promise.reject(new errors.BadRequest('Only GeoJSON FeatureCollection layers are supported'))
    }
    if (!layer.properties || !layer.properties.elements || layer.properties.elements.length === 0) {
      return Promise.reject(new errors.BadRequest('Target forecast element not specified'))
    }
    // Retrieve target elements for all models or specified one
    let services = this.app.getElementServices(layer.properties.forecast)
    services = services.filter(service => {
      return layer.properties.elements.reduce((contains, element) => contains || service.name.includes(element), false)
    })
    // Then setup all probes
    let probes = []
    services.forEach(service => {
      // Get all available forecast times or selected one
      let options = {
        paginate: false
      }
      if (layer.properties.time) {
        options.query = {
          time: moment.utc(layer.properties.time)
        }
      }
      probes.push(
        service.find(options)
        .then(async response => {
          // For each forecast time perform computation
          // WARNING : Can't use forEach with async otherwise when the loop finishes async calls are not done,
          // we need async iterators https://jakearchibald.com/2017/async-iterators-and-generators/
          for (let forecast of response) {
            await this.probeForecastTime(layer, service, forecast.forecastTime)
          }
        })
      )
    })
    // Run probing
    await Promise.all(probes)
  }
}
