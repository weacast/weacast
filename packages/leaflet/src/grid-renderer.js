import logger from 'loglevel'
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'
import chroma from 'chroma-js'

// WebGL limit
const VERTEX_BUFFER_MAX_SIZE = 65536

class GridView {
  constructor (options) {
    Object.assign(this, options)
  }

  getValue (i, j) {
    let iGrid = this.origin[0] + i
    let jGrid = this.origin[1] + j
    if (iGrid >= this.grid.size[0]) iGrid = iGrid % this.grid.size[0]
    if (jGrid >= this.grid.size[1]) jGrid = jGrid % this.grid.size[1]
    return this.grid.getValue(iGrid, jGrid)
  }

  cut () {
    const views = []
    if (this.size[0] >= this.size[1]) {
      views.push(new GridView({
        grid: this.grid,
        origin: this.origin,
        size: [Math.trunc(this.size[0] / 2) + 1, this.size[1]],
        offset: this.offset,
        sew: this.sew
      }))
      views.push(new GridView({
        grid: this.grid,
        origin: [this.origin[0] + Math.trunc(this.size[0] / 2), this.origin[1]],
        size: [Math.trunc(this.size[0] / 2) + (this.size[0] % 2), this.size[1]],
        offset: this.offset,
        sew: this.sew
      }))
    } else {
      views.push(new GridView({
        grid: this.grid,
        origin: this.origin,
        size: [this.size[0], Math.trunc(this.size[1] / 2) + 1],
        offset: this.offset,
        sew: this.sew
      }))
      views.push(new GridView({
        grid: this.grid,
        origin: [this.origin[0], this.origin[1] + Math.trunc(this.size[1] / 2)],
        size: [this.size[0], Math.trunc(this.size[1] / 2) + (this.size[1] % 2)],
        offset: this.offset,
        sew: this.sew
      }))
    }
    return views
  }
}

export class GridRenderer {
  constructor () {
    this.grid = null
    this.colorMap = null
    this.opacity = 1
    this.mesh = false
    this.nodata = {
      value: undefined,
      color: '#00000000'
    }
    this.pixiContainer = null
  }

  initialize (options) {
    Object.assign(this, options)
    if (this.mesh) {
      this.shader = PIXI.Shader.from(`
        precision mediump float;
        attribute vec2 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
        varying vec4 vColor;

        void main() {
          vColor = aVertexColor;
          gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        }`, `
        precision mediump float;
        varying vec4 vColor;
        uniform float alpha;

        void main() {
          gl_FragColor.rgb = vec3(vColor[0]*alpha, vColor[1]*alpha, vColor[2]*alpha);
          gl_FragColor.a = vColor[3]*alpha;
        }`, {
        alpha: this.opacity
      }
      )
    }
    // Create an empty container
    this.pixiContainer = new PIXI.Container()
    // Create the overlay layer
    const pixiOverlayOptions = Object.assign({ autoPreventDefault: false }, options)
    return L.pixiOverlay(utils => this.render(utils), this.pixiContainer, pixiOverlayOptions)
  }

  setGrid (grid) {
    this.pixiContainer.removeChildren()
    this.grid = grid
    if (this.grid) {
      this.sew = (grid.bounds[2] - grid.bounds[0]) === 360
    }
  }

  setGridData (data) {
    this.pixiContainer.removeChildren()
    if (!this.grid) {
      logger.warn('you must specify a grid before assigning the data')
      return
    }
    this.grid.data = data
  }

  setColorMap (colorMap) {
    this.pixiContainer.removeChildren()
    this.colorMap = colorMap
  }

  setOpacity (opacity) {
    this.opacity = opacity
  }

  getViews () {
    const views = []
    if (this.grid.bounds[2] > 180) {
      const westSize = (this.grid.bounds[2] - 180) / this.grid.resolution[0]
      const eastSize = this.grid.size[0] - westSize
      views.push(new GridView({
        grid: this.grid,
        origin: [0, 0],
        size: [westSize, this.grid.size[1]],
        offset: 0,
        sew: this.sew
      }))
      views.push(new GridView({
        grid: this.grid,
        origin: [westSize, 0],
        size: [eastSize, this.grid.size[1]],
        offset: -360,
        sew: this.sew
      }))
    } else {
      views.push(new GridView({
        grid: this.grid,
        origin: [0, 0],
        size: this.grid.size,
        offset: 0,
        sew: this.sew
      }))
    }
    return views
  }

  render (utils) {
    // If no data return
    if (this.grid && this.grid.data && this.colorMap) {
      // Retrive utils objects
      const renderer = utils.getRenderer()
      // It the PIXI container is null then build the grid
      if (this.pixiContainer.children.length === 0) {
        if (this.mesh) {
          this.getViews().forEach(view => this.buildMesh(view, utils))
        } else {
          this.getViews().forEach(view => this.buildCells(view, utils))
        }
      }
      renderer.render(this.pixiContainer)
    }
  }

  buildMesh (gridView, utils) {
    if ((gridView.size[0] * gridView.size[1]) > VERTEX_BUFFER_MAX_SIZE) {
      const subgridViews = gridView.cut()
      subgridViews.forEach(subgridView => this.buildMesh(subgridView, utils))
    } else {
      // compute the size of the mesh
      const width = gridView.size[0] + (gridView.sew ? 1 : 0)
      const height = gridView.size[1]
      // allocate the arrays
      const vertices = new Float32Array(width * height * 2)
      const colors = new Float32Array(width * height * 4)
      const indices = new Uint16Array((width - 1) * (height - 1) * 6)
      // build the mesh
      let verticesIndex = 0
      let colorsIndex = 0
      let indicesIndex = 0
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          // Compute the position
          const x = gridView.grid.origin[0] + ((gridView.origin[0] + i) * gridView.grid.resolution[0]) + gridView.offset
          const y = gridView.grid.origin[1] - ((gridView.origin[1] + j) * gridView.grid.resolution[1])
          const pos = utils.latLngToLayerPoint([y, x])
          vertices[verticesIndex++] = pos.x
          vertices[verticesIndex++] = pos.y
          // Compute the color
          const cellValue = gridView.getValue(i, j)
          let color = chroma(this.nodata.color)
          if (cellValue !== this.nodata.value) color = this.colorMap(cellValue)
          const rgb = color.gl()
          colors[colorsIndex++] = rgb[0]
          colors[colorsIndex++] = rgb[1]
          colors[colorsIndex++] = rgb[2]
          colors[colorsIndex++] = color.alpha()
          // Compute the indices
          if (i < (width - 1) && j < (height - 1)) {
            const index00 = (j * width) + i
            const index01 = index00 + 1
            const index10 = index00 + width
            const index11 = index10 + 1
            indices[indicesIndex++] = index00
            indices[indicesIndex++] = index10
            indices[indicesIndex++] = index01
            indices[indicesIndex++] = index01
            indices[indicesIndex++] = index10
            indices[indicesIndex++] = index11
          }
        }
      }
      // Build the corresponding geometry
      const geometry = new PIXI.Geometry()
        .addAttribute('aVertexPosition', vertices, 2)
        .addAttribute('aVertexColor', colors, 4)
        .addIndex(indices)
      // Build the corresponding mesh
      const mesh = new PIXI.Mesh(geometry, this.shader)
      // Add the mesh to the container
      this.pixiContainer.addChild(mesh)
    }
  }

  buildCells (gridView, utils) {
    for (let j = 0; j < gridView.size[1]; j++) {
      for (let i = 0; i < gridView.size[0]; i++) {
        const cellValue = gridView.getValue(i, j)
        const x = gridView.grid.origin[0] + ((gridView.origin[0] + i) * gridView.grid.resolution[0]) + gridView.offset
        const y = gridView.grid.origin[1] - ((gridView.origin[1] + j) * gridView.grid.resolution[1])
        const xCell = x - (gridView.grid.resolution[0] / 2)
        const yCell = y - (gridView.grid.resolution[1] / 2)
        const minCell = utils.latLngToLayerPoint([yCell, xCell])
        const maxCell = utils.latLngToLayerPoint([yCell + gridView.grid.resolution[0], xCell + gridView.grid.resolution[1]])
        const cell = new PIXI.Graphics()
        cell.beginFill(this.colorMap(cellValue).num(), this.opacity)
        cell.drawRect(minCell.x, minCell.y, maxCell.x - minCell.x, maxCell.y - minCell.y)
        cell.endFill()
        this.pixiContainer.addChild(cell)
      }
    }
  }
}
