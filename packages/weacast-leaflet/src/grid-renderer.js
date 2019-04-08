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
    let views = []
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
      // If the rendered mode is equal to mesh, we create an dedicated PIXI Renderer
      var _pixiGlCore2 = PIXI.glCore
      PIXI.mesh.MeshRenderer.prototype.onContextChange = function onContextChange () {
        var gl = this.renderer.gl
        this.shader = new PIXI.Shader(gl,
          'attribute vec2 aVertexPosition;\n' +
          'attribute vec4 aVertexColor;\n' +
          'uniform mat3 projectionMatrix;\n' +
          'uniform mat3 translationMatrix;\n' +
          'varying vec4 vColor;\n' +
          'void main(void)\n{\n' +
          '  vColor = aVertexColor;\n' +
          '  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n' +
          '}\n',
          'precision mediump float;' +
          'varying vec4 vColor;\n' +
          'uniform float alpha;\n' +
          'void main(void)\n{\n' +
          '  gl_FragColor.rgb = vec3(vColor[0]*alpha, vColor[1]*alpha, vColor[2]*alpha);\n' +
          '  gl_FragColor.a = vColor[3]*alpha;\n' +
          '}\n'
        )
      }
      PIXI.mesh.MeshRenderer.prototype.render = function render (mesh) {
        var renderer = this.renderer
        var gl = renderer.gl
        var glData = mesh._glDatas[renderer.CONTEXT_UID]
        if (!glData) {
          renderer.bindVao(null)
          glData = {
            shader: this.shader,
            vertexBuffer: _pixiGlCore2.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
            colorBuffer: _pixiGlCore2.GLBuffer.createVertexBuffer(gl, mesh.colors, gl.STREAM_DRAW),
            indexBuffer: _pixiGlCore2.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW)
          }
          // build the vao object that will render..
          glData.vao = new _pixiGlCore2.VertexArrayObject(gl)
            .addIndex(glData.indexBuffer)
            .addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 2, 0)
            .addAttribute(glData.colorBuffer, glData.shader.attributes.aVertexColor, gl.FLOAT, false, 4 * 4, 0)
          mesh._glDatas[renderer.CONTEXT_UID] = glData
        }
        renderer.bindVao(glData.vao)
        renderer.bindShader(glData.shader)
        glData.shader.uniforms.alpha = mesh.alpha
        glData.shader.uniforms.translationMatrix = mesh.worldTransform.toArray(true)
        glData.vao.draw(gl.TRIANGLES, mesh.indices.length, 0)
      }
    }
    // Create an empty container
    this.pixiContainer = new PIXI.Container()
    // Create the overlay layer
    return L.pixiOverlay(utils => this.render(utils), this.pixiContainer, {
      autoPreventDefault: false
    })
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
    let views = []
    if (this.grid.bounds[2] > 180) {
      let westSize = (this.grid.bounds[2] - 180) / this.grid.resolution[0]
      let eastSize = this.grid.size[0] - westSize
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
      let renderer = utils.getRenderer()
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
      let subgridViews = gridView.cut()
      subgridViews.forEach(subgridView => this.buildMesh(subgridView, utils))
    } else {
      // compute the size of the mesh
      let width = gridView.size[0] + (gridView.sew ? 1 : 0)
      let height = gridView.size[1]
      // allocate the arrays
      let vertices = new Float32Array(width * height * 2)
      let colors = new Float32Array(width * height * 4)
      let indices = new Uint16Array((width - 1) * (height - 1) * 6)
      // build the mesh
      let verticesIndex = 0
      let colorsIndex = 0
      let indicesIndex = 0
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          // Compute the position
          let x = gridView.grid.origin[0] + ((gridView.origin[0] + i) * gridView.grid.resolution[0]) + gridView.offset
          let y = gridView.grid.origin[1] - ((gridView.origin[1] + j) * gridView.grid.resolution[1])
          let pos = utils.latLngToLayerPoint([y, x])
          vertices[verticesIndex++] = pos.x
          vertices[verticesIndex++] = pos.y
          // Compute the color
          let cellValue = gridView.getValue(i, j)
          let color = chroma(this.nodata.color)
          if (cellValue !== this.nodata.value) color = this.colorMap(cellValue)
          let rgb = color.gl()
          colors[colorsIndex++] = rgb[0]
          colors[colorsIndex++] = rgb[1]
          colors[colorsIndex++] = rgb[2]
          colors[colorsIndex++] = color.alpha()
          // Compute the indices
          if (i < (width - 1) && j < (height - 1)) {
            let index00 = (j * width) + i
            let index01 = index00 + 1
            let index10 = index00 + width
            let index11 = index10 + 1
            indices[indicesIndex++] = index00
            indices[indicesIndex++] = index10
            indices[indicesIndex++] = index01
            indices[indicesIndex++] = index01
            indices[indicesIndex++] = index10
            indices[indicesIndex++] = index11
          }
        }
      }
      let mesh = new PIXI.mesh.Mesh(null, vertices, null, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES)
      mesh.colors = colors
      mesh.alpha = this.opacity
      this.pixiContainer.addChild(mesh)
    }
  }

  buildCells (gridView, utils) {
    for (let j = 0; j < gridView.size[1]; j++) {
      for (let i = 0; i < gridView.size[0]; i++) {
        let cellValue = gridView.getValue(i, j)
        let x = gridView.grid.origin[0] + ((gridView.origin[0] + i) * gridView.grid.resolution[0]) + gridView.offset
        let y = gridView.grid.origin[1] - ((gridView.origin[1] + j) * gridView.grid.resolution[1])
        let xCell = x - (gridView.grid.resolution[0] / 2)
        let yCell = y - (gridView.grid.resolution[1] / 2)
        let minCell = utils.latLngToLayerPoint([yCell, xCell])
        let maxCell = utils.latLngToLayerPoint([yCell + gridView.grid.resolution[0], xCell + gridView.grid.resolution[1]])
        let cell = new PIXI.Graphics()
        cell.beginFill(this.colorMap(cellValue).num(), this.opacity)
        cell.drawRect(minCell.x, minCell.y, maxCell.x - minCell.x, maxCell.y - minCell.y)
        cell.endFill()
        this.pixiContainer.addChild(cell)
      }
    }
  }
}
