/**
 * @returns {Boolean} true if the specified value is not null and not undefined.
 */
function isValue (x) {
  return x !== null && x !== undefined
}

/**
 * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
 *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
 */
function floorMod (a, n) {
  return a - n * Math.floor(a / n)
}

/**
 * @returns {Number} the value x clamped to the range [low, high].
 */
function clamp (x, min, max) {
  return Math.max(min, Math.min(x, max))
}

/**
 * @returns {Boolean} if the given point is inside the given bounding box e.g. [-180, -90, 180, 90].
 * This solution also takes in consideration a case in which the UI sends a box which crosses longitude 180/-180
 * (maps views on low zoom level where you can see the whole world, allow infinite cyclic horizontal scrolling,
 * so it is possible for example that a box's bottomLeft.lng=170 while topRight.lng=-170(=190) and by that including a range of 20 degrees
 */
function isInside (lon, lat, bounds) {
  const isLonInRange = (bounds[2] < bounds[0]
    ? lon >= bounds[0] || lon <= bounds[2]
    : lon >= bounds[0] && lon <= bounds[2])

  return lat >= bounds[1] && lat <= bounds[3] && isLonInRange
}

/**
 * @returns {Number} Returns a new longitude with the value wrapped so it's always in the same range than the given bounding box (e.g. between -180 and +180 degrees).
 */
function wrapLongitude (lon, bounds) {
  // We have longitudes in range [-180, 180] so take care if longitude is given in range [0, 360]
  if (bounds[0] < 0) {
    return lon > 180 ? lon - 360 : lon
  } else if (bounds[2] > 180) {
    // We have longitudes in range [0, 360] so take care if longitude is given in range [-180, 180]
    return lon < 0 ? lon + 360 : lon
  } else {
    return lon
  }
}

export class Grid {
  // Options are similar to those defining the forecast model + a data json array for grid point values
  // (bounds e.g. [-180, -90, 180, 90], e.g. origin: [-180, 90], e.g. size: [720, 361], e.g. resolution: [0.5, 0.5])
  constructor (options) {
    Object.assign(this, options)

    // Depending on the model longitude/latitude increases/decreases according to grid scanning
    this.lonDirection = (this.origin[0] === this.bounds[0] ? 1 : -1)
    this.latDirection = (this.origin[1] === this.bounds[1] ? 1 : -1)
    // Check for wrapped grids
    this.isContinuous = Math.floor(this.size[0] * this.resolution[0]) >= 360
  }

  getValue (i, j) {
    if (!this.data) return 0
    if (this.matrix) {
      if (i < this.size[0] && j < this.size[1]) {
        return this.data[j][i]
      } else {
        return undefined
      }
    }
    const index = i + j * this.size[0]
    if (index < this.data.length) {
      return this.data[index]
    } else {
      return undefined
    }
  }

  getIndices (lon, lat) {
    // Take care that some models express longitude in [0,360] and not [-180,180], so unify range here
    lon = wrapLongitude(lon, this.bounds)
    // Check for points outside bbox
    if (!isInside(lon, lat, this.bounds)) return undefined

    const i = this.lonDirection * floorMod(lon - this.origin[0], 360) / this.resolution[0] // calculate longitude index in wrapped range [0, 360)
    const fi = Math.floor(i)
    const j = this.latDirection * (lat - this.origin[1]) / this.resolution[1] // calculate latitude index in direction +90 to -90
    const fj = Math.floor(j)

    return [i, fi, j, fj]
  }

  // bilinear interpolation
  bilinearInterpolate (x, y, g00, g10, g01, g11) {
    const rx = (1 - x)
    const ry = (1 - y)
    const a = rx * ry
    const b = x * ry
    const c = rx * y
    const d = x * y
    return g00 * a + g10 * b + g01 * c + g11 * d
  }

  /**
   * Get interpolated grid value from Lon/Lat position
   * @param lon {Float} Longitude
   * @param lat {Float} Latitude
   * @returns {Object}
   */
  interpolate (lon, lat) {
    if (!this.data) return undefined
    const indices = this.getIndices(lon, lat)
    // Check for points outside bbox
    if (indices === undefined) return undefined
    const [i, fi, j, fj] = indices

    let ci = fi + 1
    // In this case virtually duplicate first column as last column to simplify interpolation logic
    if (this.isContinuous && ci >= this.size[0]) {
      ci = 0
    }
    ci = clamp(ci, 0, this.size[0] - 1)
    const cj = clamp(fj + 1, 0, this.size[1] - 1)

    const g00 = this.getValue(fi, fj)
    const g10 = this.getValue(ci, fj)
    const g01 = this.getValue(fi, cj)
    const g11 = this.getValue(ci, cj)

    // All four points found, so interpolate the value
    if (isValue(g00) && isValue(g10) && isValue(g01) && isValue(g11)) {
      return this.bilinearInterpolate(i - fi, j - fj, g00, g10, g01, g11)
    } else {
      return undefined
    }
  }

  /**
   * Get a resampled version of the grid based on interpolated values
   * @param origin {Array} Origin in longitude/latitude of the new data
   * @param resolution {Array} Resolution in longitude/latitude of the new data
   * @param size {Array} Grid size in longitude/latitude of the new data
   * @returns {Array}
   */
  resample (origin, resolution, size) {
    const data = []
    for (let j = 0; j < size[1]; j++) {
      for (let i = 0; i < size[0]; i++) {
        const lon = origin[0] + this.lonDirection * (i * resolution[0])
        const lat = origin[1] + this.latDirection * (j * resolution[1])
        const value = this.interpolate(lon, lat)
        data.push(value)
      }
    }
    return data
  }

  /**
   * Get tiling parameters for a tileset from the grid
   * @param resolution {Array} Tile resolution in longitude/latitude of the tileset
   * @returns {Object} tileset size, tile size, tile resolution
   */
  getTiling (resolution) {
    const lonExtent = (this.bounds[2] < this.bounds[0] ? (360 + this.bounds[2] - this.bounds[0]) : (this.bounds[2] - this.bounds[0]))
    const latExtent = (this.bounds[3] < this.bounds[1] ? (360 + this.bounds[3] - this.bounds[1]) : (this.bounds[3] - this.bounds[1]))
    // Number of tiles is bound / tile resolution
    const tilesetSize = [Math.floor(lonExtent / resolution[0]), Math.floor(latExtent / resolution[1])]
    // Size of tiles is tile bound / resolution
    const tileSize = [
      Math.floor(resolution[0] / this.resolution[0]) + 1,
      Math.floor(resolution[1] / this.resolution[1]) + 1
    ]
    const tileResolution = [this.resolution[0], this.resolution[1]]
    return { tilesetSize, tileSize, tileResolution }
  }

  /**
   * Get a tileset from the grid
   * @param resolution {Array} Tile resolution in longitude/latitude of the tileset
   * @returns {Array} a list of grid data for each tile
   */
  tileset (resolution) {
    const { tilesetSize, tileSize, tileResolution } = this.getTiling(resolution)

    const data = []
    // Iterate over tiles
    for (let j = 0; j < tilesetSize[1]; j++) {
      for (let i = 0; i < tilesetSize[0]; i++) {
        // Compute tile origin
        const tileOrigin = [this.origin[0] + this.lonDirection * (i * resolution[0]),
          this.origin[1] + this.latDirection * (j * resolution[1])]
        const tileData = []
        // Then over cell in tile
        for (let tj = 0; tj < tileSize[1]; tj++) {
          for (let ti = 0; ti < tileSize[0]; ti++) {
            const lon = tileOrigin[0] + this.lonDirection * (ti * tileResolution[0])
            const lat = tileOrigin[1] + this.latDirection * (tj * tileResolution[1])
            const value = this.interpolate(lon, lat)
            tileData.push(value)
          }
        }
        let minLon = tileOrigin[0]
        let minLat = tileOrigin[1]
        let maxLon = tileOrigin[0] + this.lonDirection * resolution[0]
        let maxLat = tileOrigin[1] + this.latDirection * resolution[1]
        // Need to switch bounds if descending order
        if (this.lonDirection < 0) [minLon, maxLon] = [maxLon, minLon]
        if (this.latDirection < 0) [minLat, maxLat] = [maxLat, minLat]
        data.push({
          x: i,
          y: j,
          bounds: [minLon, minLat, maxLon, maxLat],
          origin: tileOrigin,
          size: tileSize,
          resolution: tileResolution,
          data: tileData
        })
      }
    }
    return data
  }

  static toGeometry (bounds) {
    let [minLon, minLat, maxLon, maxLat] = bounds
    // GeoJSON WGS84 > longitude should be in [-180, 180]
    minLon = (minLon > 180 ? minLon - 360 : minLon)
    maxLon = (maxLon > 180 ? maxLon - 360 : maxLon)

    return {
      geometry: {
        type: 'Polygon',
        coordinates: [
          // Exterior ring
          [[minLon, minLat], [maxLon, minLat],
            [maxLon, maxLat], [minLon, maxLat], [minLon, minLat]] // Closing point
        ]
      }
    }
  }

  static getMinMax (data) {
    if (!data || (data.length === 0)) return undefined
    let minValue = data[0]
    let maxValue = data[0]
    for (let i = 1; i < data.length; i++) {
      minValue = Math.min(minValue, data[i])
      maxValue = Math.max(maxValue, data[i])
    }
    return { minValue, maxValue }
  }
}
