import L from 'leaflet'
import { getNearestForecastTime } from 'weacast-core/common'

let ForecastLayer = L.Layer.extend({

  initialize (api, layer, options) {
    this.api = api
    this.baseLayer = layer
    this.onForecastTimeChanged = this.fetchData.bind(this)
    L.setOptions(this, options || {})
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
    for (let element of this.options.elements) {
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
    if (!this.options.hasOwnProperty('visible') || this.options.visible) this.fetchData()
  }

})

L.Weacast = {}
L.Weacast.ForecastLayer = ForecastLayer
export { ForecastLayer }
