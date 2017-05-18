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

export class Grid {
  // Options are similar to those defining the forecast model + a data json array for grid point values
  // (bounds e.g. [-180, -90, 180, 90], e.g. origin: [-180, 90], e.g. size: [720, 361], e.g. resolution: [0.5, 0.5])
  constructor (options) {
    Object.assign(this, options)

    // Depending on the model longitude/latitude increases/decreases according to grid scanning
    this.lonDirection = (this.origin[0] === this.bounds[0] ? 1 : -1)
    this.latDirection = (this.origin[1] === this.bounds[1] ? 1 : -1)
  }

  getValue (i, j) {
    if (!this.data) return 0

    let index = i + j * this.size[0]
    if (index < this.data.length) {
      return this.data[index]
    } else {
      return null
    }
  }

  // bilinear interpolation
  bilinearInterpolate (x, y, g00, g10, g01, g11) {
    let rx = (1 - x)
    let ry = (1 - y)
    let a = rx * ry
    let b = x * ry
    let c = rx * y
    let d = x * y
    return g00 * a + g10 * b + g01 * c + g11 * d
  }

  /**
   * Get interpolated grid value from Lon/Lat position
   * @param lon {Float} Longitude
   * @param lat {Float} Latitude
   * @returns {Object}
   */
  interpolate (lon, lat) {
    if (!this.data) return null

    let i = this.lonDirection * floorMod(lon - this.origin[0], 360) / this.resolution[0] - 0.5     // calculate longitude index in wrapped range [0, 360)
    let j = this.latDirection * (lat - this.origin[1]) / this.resolution[1] - 0.5                       // calculate latitude index in direction +90 to -90
    i = clamp(i, 0, this.size[0] - 1)
    j = clamp(j, 0, this.size[1] - 1)
    let fi = Math.floor(i)
    let ci = clamp(fi + 1, 0, this.size[0] - 1)
    let fj = Math.floor(j)
    let cj = clamp(fj + 1, 0, this.size[1] - 1)

    let g00 = this.getValue(fi, fj)
    let g10 = this.getValue(ci, fj)
    let g01 = this.getValue(fi, cj)
    let g11 = this.getValue(ci, cj)

    // All four points found, so interpolate the value
    if (isValue(g00) && isValue(g10) && isValue(g01) && isValue(g11)) {
      return this.bilinearInterpolate(i - fi, j - fj, g00, g10, g01, g11)
    } else {
      return null
    }
  }

  /**
   * Get a resampled version of the grid based on interpolated values
   * @param origin {Array} Origin in longitude/latitude of the new data
   * @param resolution {Array} Resolution in longitude/latitude of the new data
   * @param size {Array} Grid size in longitude/latitude of the new data
   * @returns {Array}
   */
   resample(origin, resolution, size) {
    let data = []
    for (let j = 0; j < size[1]; j++) {
      for (let i = 0; i < size[0]; i++) {
        // Offset by pixel center
        let lon = origin[0] + this.lonDirection * (i * resolution[0] + 0.5 * resolution[0])
        let lat = origin[1] + this.latDirection * (j * resolution[1] + 0.5 * resolution[1])
        let value = this.interpolate(lon, lat)
        data.push(value)
      }
    }
    return data
   }
}
