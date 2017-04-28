import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import request from 'request'
import gtiff2json from 'gtiff2json'
import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-arpege')

export default {

  convertForecastTime (runTime, forecastTime, filePath) {
    let promise = new Promise((resolve, reject) => {
      const convertedFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.json')
      if ( fs.existsSync(convertedFilePath) ) {
        logger.info('Already converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        fs.readJson(convertedFilePath, 'utf8', (error, grid) => {
          if (error) {
            logger.error('Cannot read converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            debug('Input JSON file was : ' + convertedFilePath)
            reject(error)
          } else {
            resolve(grid)
          }
        })
        return
      }

      gtiff2json(filePath)
      .then( grid => {
        logger.info('Converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        // Change extension from tiff to json
        fs.outputJson(convertedFilePath, grid, 'utf8', error => {
          if (error) {
            logger.error('Cannot write converted ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            debug('Output JSON file was : ' + convertedFilePath)
            reject(error)
          } else {
            logger.info('Written ' + this.forecast.name + '/' + this.element.name + ' converted forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            resolve(grid)
          }
        })
      })
      .catch( error => {
        reject(error)
      })
    })

    return promise
  },

  downloadForecastTime (runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      const filePath = path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name, forecastTime.format('YYYY-MM-DD[_]HH-mm-ss') + '.tiff')
      if ( fs.existsSync(filePath) ) {
        logger.info('Already downloaded ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        resolve(filePath)
        return
      }

      // Setup request with URL, token, subset parameters for WCS
      let queryParameters = {
        token: this.forecast.token,
        REQUEST: 'GetCoverage',
        coverageid: this.element.coverageid + '___' + runTime.format(),
        subset: []
      }
      Object.entries(this.element.subsets).forEach(subset => {
        queryParameters.subset.push(subset[0] + '(' + subset[1] + ')')
      })
      queryParameters.subset.push('time(' + forecastTime.format() + ')')
      logger.info('Downloading ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
      let errorMessage = 'Could not download ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format()
      request.get({
        url: this.forecast.wcsBaseUrl,
        qs: queryParameters,
        qsStringifyOptions: { arrayFormat: 'repeat' }
      })
      .on('error', err => {
        logger.error(errorMessage, err)
        reject(err)
      })
      .on('timeout', err => {
        logger.error(errorMessage + ', provider timed out')
        reject(err)
      })
      .on('response', response => {
        if (response.statusCode != 200) {
          errorMessage += ', provider responded with HTTP code ' + response.statusCode
          logger.error(errorMessage)
          reject(new Error(errorMessage))
        }
        else {
          let file = fs.createWriteStream(filePath)
          response.pipe(file)
          file.on('finish', _ => {
            file.close();
            logger.info('Written ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            resolve(filePath)
          })
          .on('error', err => {
            logger.error(errorMessage + ', unable to write temporary file', err)
            debug('Output TIFF file was : ' + filePath)
            reject(err)
          })
        }
      })
    })

    return promise
  },

  processForecastTime (runTime, forecastTime, timeOffset, createOrPatch) {
    return this.downloadForecastTime(runTime, forecastTime)
    .then( file => {
      return this.convertForecastTime(runTime, forecastTime, file)
    })
    .then( grid => {
      return {
        runTime: runTime,
        runTimeOffset: timeOffset,
        forecastTime: forecastTime,
        data: grid
      }
    })
  },

  updateForecastTime (data, previousData) {
    // Test if we have to patch existing data or create new one
    if (previousData) {
      return this.patch(previousData._id, data)
    }
    else {
      return this.create(data)
    }
  },

  refreshForecastTime (datetime, runTime, timeOffset, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      // Retrieve last available forecast if any
      this.find({ query: { runTimeOffset: timeOffset } })
      .then(result => {
        let previousData = result.length > 0 ? result[0] : null
        // Check if we are already up-to-date
        if (previousData && runTime.isSame(previousData.runTime)) {
          logger.info('Up-to-date ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format() + ', not looking further')
          resolve()
          return
        }
        // Otherwise download and process data
        this.processForecastTime(runTime, forecastTime, timeOffset)
        .then( data => this.updateForecastTime(data, previousData) )
        .then( _ => {
          logger.info('Updated ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
          resolve()   
        })
        .catch( _ => {
          logger.info('Could not update ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
          reject()
        })
      })
    })

    return promise
  },

  harvestForecastTime (datetime, runTime, timeOffset) {
    let promise = new Promise((resolve, reject) => {
      // When data for current time is not available we might try previous data
      // check here that we go back until the configured limit limit
      // because otherwise this mean there is a real problem with the provider and/or we will have outdated data
      if (datetime.diff(runTime, 'hours') > this.forecast.oldestRunInterval / 3600) {
        reject()
        return
      }
      let forecastTime = runTime.clone().add({ hours: timeOffset / 3600 })
      this.refreshForecastTime(datetime, runTime, timeOffset, forecastTime)      
      .then( data => {
        resolve()   
      })
      .catch( _ => {
        let previousRunTime = runTime.clone().subtract({ hours: this.forecast.runInterval / 3600 })
        this.harvestForecastTime(datetime, previousRunTime, timeOffset)
        .then( _ => {
          resolve()   
        })
        .catch( _ => {
          reject()
        })
      })
    })

    return promise
  },

  async refreshData (datetime) {
    // Compute nearest run T0
    let runTime = this.getNearestRunTime(datetime)
    // Check for each forecast step if update is required
    for (let timeOffset = 0; timeOffset <= this.forecast.limit; timeOffset += this.forecast.interval) {
      try {
        await this.harvestForecastTime(datetime, runTime, timeOffset)
      }
      catch (error) {
        logger.info('Hit oldest run time limit ' + runTime.format() + ' on ' + this.forecast.name + '/' + this.element.name + ' for offset ' + timeOffset +
          ', there is a too much big gap in data from the provider')
      }
    }
  }
}
