
export class Grid {
  constructor(minLon, minLat, dLon, dLat, nx, ny, data) {
    this.minLon = minLon
    this.minLat = minLat  // the grid's origin (e.g., 0.0E, 90.0N)
    this.dLon = dLon
    this.dLat = dLat      // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
    this.ni = nx
    this.nj = ny          // number of grid points W-E and N-S (e.g., 144 x 73)
    this.data = data
  }

  getValue(i, j) {
    if (!this.data) return 0

    let index = i + j * this.ni
    if ( index < this.data.length ) {
      return this.data[i + j * this.ni]
    }
    else {
      return null
    }
  }

  // interpolation for vectors like wind (u,v,m)
  bilinearInterpolateVector (x, y, g00, g10, g01, g11) {
    let rx = (1 - x)
    let ry = (1 - y)
    let a = rx * ry,  b = x * ry,  c = rx * y,  d = x * y
    return g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d
  }

  /**
   * Get interpolated grid value from Lon/Lat position
   * @param lon {Float} Longitude
   * @param lat {Float} Latitude
   * @returns {Object}
   */
  interpolate (lon, lat) {

    if (!this.data) return null

    let i = this.floorMod(lon - this.minLon, 360) / this.dLon  // calculate longitude index in wrapped range [0, 360)
    let j = (this.minLat - lat) / this.dLat               // calculate latitude index in direction +90 to -90

    let fi = Math.floor(i), ci = fi + 1
    let fj = Math.floor(j), cj = fj + 1

    let g00 = this.getValue(fi, fj)
    let g10 = this.getValue(ci, fj)
    let g01 = this.getValue(ci, cj)
    let g11 = this.getValue(ci, cj)
     
    // All four points found, so interpolate the value
    if ( this.isValue(g00) && this.isValue(g10) && this.isValue(g01) && this.isValue(g11) ) {
      return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11)
    }
    else {
      return null
    }
  }
  /**
   * @returns {Boolean} true if the specified value is not null and not undefined.
   */
  isValue (x) {
    return x !== null && x !== undefined
  }

  /**
   * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
   *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
   */
  floorMod (a, n) {
    return a - n * Math.floor(a / n)
  }

  /**
   * @returns {Number} the value x clamped to the range [low, high].
   */
  clamp (x, range) {
    return Math.max(range[0], Math.min(x, range[1]))
  }
}
