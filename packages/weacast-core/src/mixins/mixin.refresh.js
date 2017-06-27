import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import request from 'request'
import errors from 'feathers-errors'
import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-core')

export default {

  // Retrieve the path where downloaded/persited data are
  getDataDirectory () {
    return path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name)
  },

  // Generate file name to store temporary output (i.e. converted) data, assume by default a similar name than getForecastTimeFilePath() with a json extension
  getForecastTimeConvertedFilePath (runTime, forecastTime) {
    let filePath = this.getForecastTimeFilePath(runTime, forecastTime)
    return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.json')
  },

  downloadForecastTime (runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
      if (fs.existsSync(filePath)) {
        logger.verbose('Already downloaded ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        resolve(filePath)
        return
      }
      // Get request options
      logger.verbose('Downloading ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
      let errorMessage = 'Could not download ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format()
      // Get request options
      request.get(this.getForecastTimeRequest(runTime, forecastTime))
      .on('error', err => {
        logger.error(errorMessage, err)
        reject(err)
      })
      .on('timeout', err => {
        logger.error(errorMessage + ', provider timed out')
        reject(err)
      })
      .on('response', response => {
        if (response.statusCode !== 200) {
          errorMessage += ', provider responded with HTTP code ' + response.statusCode
          logger.error(errorMessage)
          reject(new errors.NotFound(errorMessage))
        } else {
          let file = fs.createWriteStream(filePath)
          response.pipe(file)
          file.on('finish', _ => {
            file.close()
            logger.verbose('Written ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
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

  async processForecastTime (runTime, forecastTime) {
    await this.downloadForecastTime(runTime, forecastTime)
    let grid = await this.convertForecastTime(runTime, forecastTime)
    if (this.element.dataStore === 'gridfs') {
      await this.saveToGridFS(this.getForecastTimeConvertedFilePath(runTime, forecastTime))
    }
    // Compute min/max values
    let min = (grid && grid.length > 0 ? grid[0] : Number.NEGATIVE_INFINITY)
    let max = (grid && grid.length > 0 ? grid[0] : Number.POSITIVE_INFINITY)
    for (let i = 1; i < this.forecast.size[0] * this.forecast.size[1]; i++) {
      min = Math.min(min, grid[i])
      max = Math.max(max, grid[i])
    }
    let forecast = {
      runTime: runTime,
      forecastTime: forecastTime,
      minValue: min,
      maxValue: max
    }
    // Depending if we keep file as data storage include a link to files or data directly in the object
    if (this.element.dataStore === 'fs' || this.element.dataStore === 'gridfs') {
      return Object.assign(forecast, {
        filePath: this.getForecastTimeFilePath(runTime, forecastTime),
        convertedFilePath: this.getForecastTimeConvertedFilePath(runTime, forecastTime)
      })
    } else {
      return Object.assign(forecast, {
        data: grid
      })
    }
  },

  updateForecastTimeInDatabase (data, previousData) {
    // Test if we have to patch existing data or create new one
    if (previousData) {
      // The simplest and most efficient way is to update existing forecast
      // However there is a bug in this case, it seems that the input data is mutated
      // Just before inserting it in the DB (_id is reported to be null by the adapter)
      // this.update(previousData._id, data)
      // For now we use a remove/create workaround
      return this.remove(previousData._id)
      .then(_ => {
        // Remove persistent file associated with data
        if (this.element.dataStore === 'fs') {
          fs.remove(previousData.convertedFilePath)
        } else if (this.element.dataStore === 'gridfs') {
          this.removeFromGridFS(previousData.convertedFilePath)
        }
        return this.create(data)
      })
    } else {
      return this.create(data)
    }
  },

  refreshForecastTime (datetime, runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      // Retrieve last available forecast if any
      this.find({
        query: {
          $select: ['_id', 'runTime', 'forecastTime'], // We only need object ID
          forecastTime: forecastTime
        }
      })
      .then(result => {
        let previousData = (result.data.length > 0 ? result.data[0] : null)
        // Check if we are already up-to-date
        if (previousData && runTime.isSameOrBefore(previousData.runTime)) {
          logger.verbose('Up-to-date ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format() + ', not looking further')
          resolve(previousData)
          return
        }
        // Otherwise download and process data
        this.processForecastTime(runTime, forecastTime)
        .then(data => {
          this.updateForecastTimeInDatabase(data, previousData)
          .then(data => {
            logger.verbose((previousData ? 'Updated ' : 'Created ') + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
            // Remove temporary file associated with data except when using fs data store
            if (this.element.dataStore !== 'fs') {
              const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
              const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
              // FIXME: trying to remove temporary files as soon as possible raises "EBUSY: resource busy or locked" because there is probably some async operation still running
              // For now we remove temporary files as a whole by removing the data dir on each update process of the element
              // if (fs.existsSync(filePath)) fs.remove(filePath)
              // if (fs.existsSync(convertedFilePath)) fs.remove(convertedFilePath)
            }
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
        })
        .catch(error => {
          reject(error)
        })
      })
    })

    return promise
  },

  harvestForecastTime (datetime, runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      this.refreshForecastTime(datetime, runTime, forecastTime)
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        logger.error('Could not update ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        // 404 might be 'normal' errors because some data are not available at the planned run time from meteo providers
        if (!error.code || error.code !== 404) {
          logger.error(error)
        }
        let previousRunTime = runTime.clone().subtract({ seconds: this.forecast.runInterval })
        // When data for current time is not available we might try previous data
        // check here that we go back until the configured limit
        // because otherwise this means there is a real problem with the provider and/or we will have outdated data
        if (datetime.diff(previousRunTime, 'seconds') > this.forecast.oldestRunInterval) {
          logger.verbose('Hit oldest run time limit ' + runTime.format() + ' on ' + this.forecast.name + '/' + this.element.name + ', there is a too much big gap in data from the provider')
          reject(error)
          return
        }

        logger.verbose('Harvesting further run time ' + previousRunTime.format() + ' on ' + this.forecast.name + '/' + this.element.name)
        resolve(this.harvestForecastTime(datetime, previousRunTime, forecastTime))
      })
    })

    return promise
  },

  async refreshForecastData (datetime) {
    // Compute nearest run T0
    let runTime = this.getNearestRunTime(datetime)
    // We don't care about the past, however a forecast is still potentially valid at least until we reach the next one
    let lowerTime = datetime.clone().subtract({ seconds: this.forecast.interval })
    // Check for each forecast step if update is required
    for (let timeOffset = this.forecast.lowerLimit; timeOffset <= this.forecast.upperLimit; timeOffset += this.forecast.interval) {
      let forecastTime = runTime.clone().add({ seconds: timeOffset })
      let discard = false
      if (!this.forecast.keepPastForecasts) {
        discard = forecastTime.isBefore(lowerTime)
      }
      if (!discard) {
        try {
          await this.harvestForecastTime(datetime, runTime, forecastTime)
        } catch (error) {
          // This catch does not rethrow the error so that the update process will not stop and tray again at next refresh
        }
      }
    }
  },

  async updateForecastData (mode = 'interval') {
    logger.info('Checking for up-to-date forecast data on ' + this.forecast.name + '/' + this.element.name)
    // Make sure we've got somewhere to put data and clean it up if we only use file as a temporary data store
    let dataDir = this.getDataDirectory()
    if (this.element.dataStore === 'fs') {
      fs.ensureDirSync(dataDir)
    } else {
      fs.emptyDirSync(dataDir)
    }
    const now = moment.utc()
    try {
      // Try data refresh for current time
      await this.refreshForecastData(now)
      logger.info('Completed forecast data update on ' + this.forecast.name + '/' + this.element.name)
      // Then plan next update according to provided update interval if required
      if (mode === 'interval') {
        await setTimeout(_ => this.updateForecastData('interval'), 1000 * this.forecast.updateInterval)
      }
    } catch (error) {
    }
  }
}
