import L from 'leaflet'
import 'leaflet-velocity'
import 'leaflet-velocity/dist/leaflet-velocity.css'
import { createColorMap } from 'weacast-core/common'
import { ForecastLayer } from './forecast-layer'

let FlowLayer = ForecastLayer.extend({

  initialize (api, options) {
    // FIXME : make this dynamic, ie relative mode based on min/max when data are set
    this.colorMap = createColorMap(options)
    // Merge options with default for undefined ones
    const layerOptions = Object.assign({
      displayValues: true,
      displayOptions: {
        velocityType: 'Wind',
        position: 'bottomright',
        emptyString: 'No wind data',
        angleConvention: 'bearingCW',
        speedUnit: 'kt'
      },
      minVelocity: this.colorMap.domain()[0],
      maxVelocity: this.colorMap.domain()[1],
      velocityScale: 0.01,      // modifier for particle animations, arbitrarily defaults to 0.005
      colorScale: this.colorMap.colors(),
      data: null                // data will be requested on-demand
    }, options)
    let layer = L.velocityLayer(layerOptions)
    ForecastLayer.prototype.initialize.call(this, api, layer, options)

    // Format in leaflet-velocity layer data model
    this.uFlow = {
      header: {
        parameterCategory: 2,
        parameterNumber: 2
      },
      data: []
    }
    this.vFlow = {
      header: {
        parameterCategory: 2,
        parameterNumber: 3
      },
      data: []
    }
  },

  setData (data) {
    if (data.length > 1) {
      this.uFlow.data = data[0].data
      this.vFlow.data = data[1].data
      this.baseLayer.setData([this.uFlow, this.vFlow])
      ForecastLayer.prototype.setData.call(this, data)
    } else {
      this.uFlow.data = []
      this.vFlow.data = []
      this.hasData = false
      this.baseLayer.setData([this.uFlow, this.vFlow])
    }
  },

  setForecastModel (model) {
    // Format in leaflet-velocity layer data model
    let modelHeader = {
      nx: model.size[0],
      ny: model.size[1],
      lo1: model.origin[0],
      la1: model.origin[1],
      dx: model.resolution[0],
      dy: model.resolution[1]
    }
    Object.assign(this.uFlow.header, modelHeader)
    Object.assign(this.vFlow.header, modelHeader)
    ForecastLayer.prototype.setForecastModel.call(this, model)
  }

})

L.weacast.FlowLayer = FlowLayer
L.weacast.flowLayer = function(api, options) {
  return new L.weacast.FlowLayer(api, options)
}
export { FlowLayer }
