import L from 'leaflet'
import { ForecastLayer } from './forecast-layer'
import { Grid, createColorMap } from 'weacast-core/client'
import { GridRenderer } from '../grid-renderer'

let ScalarLayer = ForecastLayer.extend({

  initialize (api, options) {
    // Merge options with default for undefined ones
    this.options = Object.assign({
      interpolate: true,
      scale: 'OrRd',
      opacity: 0.5,
      mesh: true
    }, options)
    this.gridRenderer = new GridRenderer()
    let gridOverlay = this.gridRenderer.initialize(this.options)
    ForecastLayer.prototype.initialize.call(this, api, gridOverlay, options)
  },

  setData (data) {
    if (data.length > 0) {
      this.minValue = data[0].minValue
      this.maxValue = data[0].maxValue
      this.colorMap = createColorMap(this.options, [this.minValue, this.maxValue])
      this.gridRenderer.setGridData(data[0].data)
      this.gridRenderer.setColorMap(this.colorMap)
      this.gridRenderer.setOpacity(this.options.opacity)
      this.baseLayer.redraw()
      ForecastLayer.prototype.setData.call(this, data)
    } else {
      this.gridRenderer.setGridData(null)
      this.hasData = false
    }
  },

  setForecastModel (model) {
    this.grid = new Grid(model)
    this.gridRenderer.setGrid(this.grid)
    ForecastLayer.prototype.setForecastModel.call(this, model)
  }
})

L.weacast.ScalarLayer = ScalarLayer
L.weacast.scalarLayer = function (api, options) {
  return new L.weacast.ScalarLayer(api, options)
}
export { ScalarLayer }
