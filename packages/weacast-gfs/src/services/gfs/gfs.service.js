import path from 'path'
import fs from 'fs-extra'
import errors from 'feathers-errors'
import grib2json from 'weacast-grib2json'
import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-gfs')

export default {

  // Perform conversion from input TIFF to JSON
  convertForecastTime (runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
      const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
      if (fs.existsSync(convertedFilePath)) {
        logger.verbose('Already converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        fs.readJson(convertedFilePath, 'utf8')
        .then(grid => {
          resolve(grid)
        })
        .catch(error => {
          logger.error('Cannot read converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
          debug('Input JSON file was : ' + convertedFilePath)
          reject(error)
        })
        return
      }

      grib2json(filePath, {
        data: true,
        bufferSize: 1024 * 1024 * 1024
      })
      .then(json => {
        if (json.length === 0 || !json[0].data || !json[0].data.length > 0) {
          const errorMessage = 'Converted ' + this.forecast.name + '/' + this.element.name + ' forecast data at ' + forecastTime.format() + ' for run ' + runTime.format() + ' is invalid or empty'
          logger.error(errorMessage)
          debug('Output JSON file was : ' + convertedFilePath)
          reject(errors.Unprocessable(errorMessage))
          return
        } else {
          logger.verbose('Converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        }
        // Change extension from tiff to json
        fs.outputJson(convertedFilePath, json[0].data, 'utf8')
        .then(_ => {
          logger.verbose('Written ' + this.forecast.name + '/' + this.element.name + ' converted forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
          resolve(json[0].data)
        })
        .catch(error => {
          logger.error('Cannot write converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
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
    return path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name, runTime.format('YYYY-MM-DD[_]HH-mm-ss') + '_' + forecastTime.format('YYYY-MM-DD[_]HH-mm-ss') + '.grib')
  },

  // Build the request options to download given forecast time from input WCS data source
  getForecastTimeRequest (runTime, forecastTime) {
    // Directories are organized by run time
    let subDirectory = '/gfs.' + runTime.format('YYYYMMDDHH')
    // Then we need to target the right file for forecast time
    // Get offset from run time
    let hours = forecastTime.diff(runTime, 'hours')
    // Convert to string with zero padding like 006
    hours = hours.toFixed(0)
    while (hours.length < 3) hours = '0' + hours
    // Get resolution expressed as XpXX
    let resolution = this.forecast.resolution.length > 0 ? this.forecast.resolution[0] : 0.5
    resolution = resolution.toFixed(2).replace('.', 'p')
    // Specific case of 0.5° model
    if (resolution === '0p50') {
      resolution = 'full.' + resolution
    } else {
      resolution = '.' + resolution
    }
    let file = 'gfs.t' + runTime.format('HH') + 'z.pgrb2' + resolution + '.f' + hours
    // Setup request with URL, variable, level parameters for HTTP filter
    let queryParameters = {
      dir: subDirectory,
      file
    }
    if (this.element.variable.startsWith('var_')) {
      queryParameters[this.element.variable] = 'on'
    } else {
      queryParameters['var_' + this.element.variable.toUpperCase()] = 'on'
    }
    if (this.element.levels) {
      this.element.levels.forEach(level => {
        queryParameters[level.startsWith('lev_') ? level : 'lev_' + level] = 'on'
      })
    }
    return {
      url: this.forecast.baseUrl,
      qs: queryParameters
    }
  }
}
