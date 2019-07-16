import L from 'leaflet'
import { getNearestForecastTime } from 'weacast-core/common'

let ForecastLayer = L.Layer.extend({

  initialize (api, layer, options) {
    this.api = api
    this.baseLayer = layer
    this.onForecastTimeChanged = this.fetchData.bind(this)
    L.setOptions(this, options || {})
    this.forecastElements = this.options.elements
  },

  onAdd (map) {
    map.addLayer(this.baseLayer)
    this.api.on('forecast-time-changed', this.onForecastTimeChanged)
    this.fetchData()
  },

  onRemove (map) {
    map.removeLayer(this.baseLayer)
    this.api.removeListener('forecast-time-changed', this.onForecastTimeChanged)
  },

  getQuery () {
    // Default implementation
    return {
      query: {
        time: this.currentForecastTime.format(),
        $select: ['forecastTime', 'data', 'minValue', 'maxValue'],
        $paginate: false,
        // Resample according to input parameters
        oLon: this.forecastModel.origin[0],
        oLat: this.forecastModel.origin[1],
        sLon: this.forecastModel.size[0],
        sLat: this.forecastModel.size[1],
        dLon: this.forecastModel.resolution[0],
        dLat: this.forecastModel.resolution[1]
      }
    }
  },

  getColorMap (nbColors) {
    if (!this.colorMap) return
    // Convert from chromajs object to value/color ramp
    const dm = this.colorMap.domain()[0]
    const dd = this.colorMap.domain()[1] - dm

    let colorMap = []
    for (let i = 0; i < nbColors; i++) {
      const value = dm + ((i / (nbColors - 1)) * dd)
      colorMap.push({ value, color: this.colorMap(value) })
    }
    return colorMap
  },

  setData (data) {
    // To be overriden, call ancestor to set flag and send event
    this.hasData = true
    this.fire('data', data)
  },

  fetchData () {
    // Not yet ready
    if (!this.forecastModel || !this.api.getForecastTime()) return
    // Find nearest available data
    this.currentForecastTime = getNearestForecastTime(this.api.getForecastTime(), this.forecastModel.interval)
    // Already up-to-date ?
    if (this.downloadedForecastTime && this.downloadedForecastTime.isSame(this.currentForecastTime)) return
    this.downloadedForecastTime = this.currentForecastTime.clone()
    // Query data for current time
    let query = this.getQuery()
    let queries = []
    for (let element of this.forecastElements) {
      const serviceName = this.forecastModel.name + '/' + element
      queries.push(this.api.getService(serviceName).find(query))
    }

    return Promise.all(queries)
    .then(results => {
      // To be reactive directly set data after download, flatten because find returns an array even if a single element is selected
      this.setData([].concat(...results))
    })
  },

  setForecastModel (model) {
    this.forecastModel = model
    this.downloadedForecastTime = null
    // This will launch a refresh
    this.fetchData()
  },

  setForecastElements (elements) {
    this.forecastElements = elements
    this.downloadedForecastTime = null
    // This will launch a refresh
    this.fetchData()
  },

  getBounds () {
    let bounds = new L.LatLngBounds()
    if (this.baseLayer && this.baseLayer.getBounds) {
      bounds.extend(this.baseLayer.getBounds())
    } else if (this.forecastModel) {
      let minLon = this.forecastModel.bounds[0]
      let minLat = this.forecastModel.bounds[1]
      let maxLon = this.forecastModel.bounds[2]
      let maxLat = this.forecastModel.bounds[3]
      // Take care that leaflet uses [-180, 180]
      if (maxLon > 180) {
        minLon -= 180
        maxLon -= 180
      }
      bounds.extend([minLat, minLon])
      bounds.extend([maxLat, maxLon])
    }
    return bounds
  }

})

L.weacast = {}
L.weacast.ForecastLayer = ForecastLayer
L.weacast.forecastLayer = function (api, layer, options) {
  return new L.weacast.ForecastLayer(api, layer, options)
}
export { ForecastLayer }
