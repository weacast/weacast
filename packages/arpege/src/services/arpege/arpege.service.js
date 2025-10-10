import path from 'path'
import fs from 'fs-extra'
import gtiff2json from '@weacast/gtiff2json'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-arpege')

export default {

  // Perform conversion from input TIFF to JSON
  convertForecastTime (runTime, forecastTime) {
    // Limit precision because default accuracy is usually not required
    const replacer = (key, value) => value.toFixed ? Number(value.toFixed(this.element.precision || 2)) : value

    const promise = new Promise((resolve, reject) => {
      const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
      const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
      if (fs.existsSync(convertedFilePath)) {
        this.app.logger.verbose('Already converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        fs.readJson(convertedFilePath, 'utf8')
          .then(grid => {
            resolve(grid)
          })
          .catch(error => {
            this.app.logger.error('Cannot read converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            debug('Input JSON file was : ' + convertedFilePath)
            reject(error)
          })
        return
      }

      gtiff2json(filePath)
        .then(grid => {
          this.app.logger.verbose('Converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
          // Change extension from tiff to json
          fs.outputJson(convertedFilePath, grid, { encoding: 'utf8', replacer })
            .then(_ => {
              this.app.logger.verbose('Written ' + this.forecast.name + '/' + this.element.name + ' converted forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
              resolve(grid)
            })
            .catch(error => {
              this.app.logger.error('Cannot write converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
              debug('Output JSON file was : ' + convertedFilePath)
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    })

    return promise
  },

  // Generate file name to store temporary input data with the right format extension
  getForecastTimeFilePath (runTime, forecastTime) {
    return path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name, runTime.format('YYYY-MM-DD[_]HH-mm-ss') + '_' + forecastTime.format('YYYY-MM-DD[_]HH-mm-ss') + '.tiff')
  },

  // Build the request options to download given forecast time from input WCS data source
  getForecastTimeRequest (runTime, forecastTime) {
    let suffix = ''
    // Check for accumulation period on accumulated elements
    let accumulationPeriod = this.element.accumulationPeriod || 0
    if (accumulationPeriod > 0) {
      // Jump to hours
      accumulationPeriod = accumulationPeriod / 3600
      // When less than 1 day suffix is PTXH
      if (accumulationPeriod < 24) suffix = '_PT' + accumulationPeriod + 'H'
      // When more than 1 day suffix is PXD
      else suffix = '_P' + (accumulationPeriod / 24) + 'D'
    }
    // Setup request with URL, token, subset parameters for WCS
    const queryParameters = {
      REQUEST: 'GetCoverage',
      coverageid: this.element.coverageid + '___' + runTime.format() + suffix,
      subset: []
    }
    if (this.element.subsets) {
      Object.entries(this.element.subsets).forEach(subset => {
        queryParameters.subset.push(subset[0] + '(' + subset[1] + ')')
      })
    }
    queryParameters.subset.push('time(' + forecastTime.format() + ')')
    return {
      url: this.forecast.wcsBaseUrl,
      qs: queryParameters,
      qsStringifyOptions: { arrayFormat: 'repeat' },
      headers: {
        apikey: this.forecast.token
      }
    }
  }
}
