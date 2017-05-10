import L from 'leaflet'
import HeatmapOverlay from 'leaflet-heatmap'
import 'leaflet-timedimension/dist/leaflet.timedimension.src.js'
import api from 'src/api'

let HeatLayer = L.TimeDimension.Layer.extend({

  initialize (options) {
    let layer = new HeatmapOverlay({
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      radius: 0.15,
      minOpacity: 0,
      maxOpacity: 0.8,
      // scales the radius based on map zoom
      scaleRadius: true,
      // custom gradient colors
      /*
      gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '0': 'black',
        '1': 'white'
      },
      */
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      useLocalExtrema: true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'value'
    })
    L.TimeDimension.Layer.prototype.initialize.call(this, layer, options)
    // Format in leaflet-heatmap layer data model
    this.heat = {
      min: 0,                   // min will be adjusted on-demand
      max: 0,                   // max will be adjusted on-demand
      data: []                  // data will be requested on-demand
    }
  },

  onAdd (map) {
    L.TimeDimension.Layer.prototype.onAdd.call(this, map)
    map.addLayer(this._baseLayer)
    if (this._timeDimension) {
      this.currentForecastTime = new Date(this._timeDimension.getCurrentTime())
      this.fetchData()
    }
  },

  _onNewTimeLoading (event) {
    this.currentForecastTime = new Date(event.time)
    this.fetchData()
  },

  isReady (time) {
    return (this.downloadedForecastTime ? this.downloadedForecastTime.getTime() === time : false)
  },

  _update () {
    this._baseLayer.setData(this.heat)
    return true
  },

  fetchAvailableTimes () {
    return api.service('/' + this.forecastModel.name + '/' + this.options.element).find({
      query: {
        $paginate: false,
        $select: ['forecastTime']
      }
    })
    .then(response => {
      let times = response.map(item => item.forecastTime)
      this._timeDimension.setAvailableTimes(times.join(), 'replace')
    })
  },

  fetchData () {
    // Not yet ready
    if (!this.forecastModel || !this.currentForecastTime) return
    // Already up-to-date ?
    if (this.downloadedForecastTime &&
        (this.currentForecastTime.getTime() === this.downloadedForecastTime.getTime())) return

    // Query wind for current time
    let query = {
      query: {
        time: this.currentForecastTime.toISOString(),
        $select: ['forecastTime', 'data', 'minValue', 'maxValue']
      }
    }

    api.service('/' + this.forecastModel.name + '/' + this.options.element).find(query)
    .then(response => {
      // Keep track of downloaded data
      this.downloadedForecastTime = new Date(response.data[0].forecastTime)
      this.heat.min = response.data[0].minValue
      this.heat.max = response.data[0].maxValue
      let data = response.data[0].data
      // Depending on the model longitude/latitude increases/decreases according to grid scanning
      let lonDirection = (this.forecastModel.origin[0] === this.forecastModel.bounds[0] ? 1 : -1)
      let latDirection = (this.forecastModel.origin[1] === this.forecastModel.bounds[1] ? 1 : -1)
      this.heat.data = []
      for (let j = 0; j < this.forecastModel.size[1]; j++) {
        for (let i = 0; i < this.forecastModel.size[0]; i++) {
          let value = data[i + j * this.forecastModel.size[1]]
          let lng = this.forecastModel.origin[0] + lonDirection * (i * this.forecastModel.resolution[0])
          let lat = this.forecastModel.origin[1] + latDirection * (j * this.forecastModel.resolution[1])
          this.heat.data.push({
            lat,
            lng,
            value
          })
        }
      }
    })
  },

  setForecastModel (model) {
    this.forecastModel = model
    // This will launch a refresh
    this.fetchAvailableTimes()
  }

})

export default HeatLayer
