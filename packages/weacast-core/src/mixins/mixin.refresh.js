import path from 'path'
import fs from 'fs-extra'
import _ from 'lodash'
import moment from 'moment'
import request from 'request'
import errors from 'feathers-errors'
import logger from 'winston'
import makeDebug from 'debug'
import { Grid } from '../common/grid'
const debug = makeDebug('weacast:weacast-core')

function getMinMax(grid) {
  let minValue = (grid && grid.length > 0 ? grid[0] : Number.NEGATIVE_INFINITY)
  let maxValue = (grid && grid.length > 0 ? grid[0] : Number.POSITIVE_INFINITY)
  for (let i = 1; i < grid.length; i++) {
    minValue = Math.min(minValue, grid[i])
    maxValue = Math.max(maxValue, grid[i])
  }
  return { minValue, maxValue }
}

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
          reject(errors.convert({
            name: response.statusCode,
            message: errorMessage
          }))
        } else {
          let file = fs.createWriteStream(filePath)
          response.pipe(file)
          .on('finish', _ => {
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
    // Check for processing function
    if (typeof this.element.transform === 'function') {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = this.element.transform({
          runTime, forecastTime, value: grid[i], index: i, data: grid, forecast: this.forecast, element: this.element
        })
      }
    }
    // Compute min/max values
    let forecast = Object.assign({
      runTime: runTime,
      forecastTime: forecastTime
    }, getMinMax(grid))
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

  async updateForecastTimeInDatabase (data, previousData) {
    // Test if we have to remove existing data first
    if (previousData) {
      await this.remove(null, {
        query: {
          forecastTime: data.forecastTime,
          geometry: { $exists: false } // Raw data doesn't have a geometry
        }
      })
      // Remove persistent file associated with data if any
      if (this.element.dataStore === 'fs') {
        fs.remove(previousData.convertedFilePath)
      } else if (this.element.dataStore === 'gridfs') {
        this.removeFromGridFS(previousData.convertedFilePath)
      }
    }

    let result = await this.create(data)
    // Save tiles if tiling is enabled
    if (this.forecast.tileResolution) {
      let grid = new Grid({
        bounds: this.forecast.bounds,
        origin: this.forecast.origin,
        size: this.forecast.size,
        resolution: this.forecast.resolution,
        data: data.data
      })
      let tiles = grid.tileset(this.forecast.tileResolution)
      tiles = tiles.map(tile =>
        Object.assign(Grid.toGeometry(tile.bounds),
                      tile,
                      getMinMax(tile.data),
                      _.pick(data, ['runTime', 'forecastTime']),
                      { timeseries: false }) // Tag this is not an aggregated tile
      )
      // Test if we have to remove existing data first
      if (previousData) {
        await this.remove(null, {
          query: {
            forecastTime: data.forecastTime,
            geometry: { $exists: true } // Only tiles have a geometry
          }
        })
      }
      await this.create(tiles)
      // Do not keep track of all in-memory data
      tiles.forEach(tile => delete tile.data)
    }
    return result
  },

  async aggregateTiles () {
    const collection = this.Model
    const grid = new Grid({
      bounds: this.forecast.bounds,
      origin: this.forecast.origin,
      size: this.forecast.size,
      resolution: this.forecast.resolution
    })
    const { tilesetSize } = grid.getTiling(this.forecast.tileResolution)
    logger.verbose('Aggregating tiles for ' + this.forecast.name + '/' + this.element.name + ' forecast')
    // Iterate over tiles
    for (let j = 0; j < tilesetSize[1]; j++) {
      for (let i = 0; i < tilesetSize[0]; i++) {
        // Delete previous aggregated tile if any
        await this.remove(null, { query: { x: i, y: j, timeseries: true } })
        // Aggregate data over time for current tile
        let tiles = await collection.aggregate([{
          // Select only single and available data for current tile
          $match: { x: i, y: j, timeseries: false, data: { $exists: true } }
        }, {
          $group: {
            _id: { x: '$x', y: '$y' }, // Group by tile so that we get a single merged result
            forecastTime: { $push: '$forecastTime' }, // Keep track of all forecast times
            runTime: { $push: '$runTime' }, // Keep track of all run times
            data: { $push: '$data' }, // Accumulate data
            minValue: { $push: '$minValue' }, // Accumulate min
            maxValue: { $push: '$maxValue' }, // Accumulate max
            geometry: { $last: '$geometry' }, // geometry is similar for all results, keep last
          }
        }]).toArray()
        if (tiles.length !== 1) {
          logger.error('Could not aggregate tiles for ' + this.forecast.name + '/' + this.element.name + ' forecast')
        } else {
          const tile = tiles[0]
          // Delete temporary tiles with a single forecast time
          await this.remove(null, { query: { x: i, y: j } })
          // Then save aggregated tile extracting x/y from group by ID and tagging as timeseries aggregation
          Object.assign(tile, tile._id, { timeseries: true })
          delete tile._id
          await this.create(tile)
        }
      }
    }
  },

  async refreshForecastTime (datetime, runTime, forecastTime) {
    // Retrieve last available forecast if any
    let result = await this.find({
      query: {
        $select: ['_id', 'runTime', 'forecastTime'], // We only need object ID
        forecastTime
      },
      paginate: false
    })

    let previousData = (result.length > 0 ? result[0] : null)
    // Check if we are already up-to-date
    if (previousData && runTime.isSameOrBefore(previousData.runTime)) {
      logger.verbose('Up-to-date ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format() + ', not looking further')
      return previousData
    }
    // Otherwise download and process data
    let data = await this.processForecastTime(runTime, forecastTime)
    data = await this.updateForecastTimeInDatabase(data, previousData)
    logger.verbose((previousData ? 'Updated ' : 'Created ') + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
    // Remove temporary file associated with data except when using fs data store
    // FIXME: trying to remove temporary files as soon as possible raises "EBUSY: resource busy or locked" because there is probably some async operation still running
      // For now we remove temporary files as a whole by removing the data dir on each update process of the element
    /*
    if (this.element.dataStore !== 'fs') {
      const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
      const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
      if (fs.existsSync(filePath)) fs.remove(filePath)
      if (fs.existsSync(convertedFilePath)) fs.remove(convertedFilePath)
    }
    */
    return data
  },

  async harvestForecastTime (datetime, runTime, forecastTime) {
    try {
      let result = await this.refreshForecastTime(datetime, runTime, forecastTime)
      // Do not keep track of all in-memory data
      delete result.data
      return result
    } catch (error) {
      // 404 might be 'normal' errors because some data are not available at the planned run time from meteo providers
      // or some might vary the time steps available in the forecast depending on the run
      if (!error || !error.code || error.code !== 404) {
        logger.error('Could not update ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        logger.error(error.message)
      } else {
        logger.verbose('Could not update ' + this.forecast.name + '/' + this.element.name + ' forecast at ' + forecastTime.format() + ' for run ' + runTime.format())
        logger.verbose(error.message)
      }
      let previousRunTime = runTime.clone().subtract({ seconds: this.forecast.runInterval })
      // When data for current time is not available we might try previous data
      // check here that we go back until the configured limit
      // because otherwise this means there is a real problem with the provider and/or we will have outdated data
      if (datetime.diff(previousRunTime, 'seconds') > this.forecast.oldestRunInterval) {
        logger.verbose('Hit oldest run time limit ' + runTime.format() + ' on ' + this.forecast.name + '/' + this.element.name + ', there is a too much big gap in data from the provider')
        throw error
      } else {
        logger.verbose('Harvesting further run time ' + previousRunTime.format() + ' on ' + this.forecast.name + '/' + this.element.name)
        await this.harvestForecastTime(datetime, previousRunTime, forecastTime)
      }
    }
  },

  async refreshForecastData (datetime) {
    // Retrieve forecast or overriden element update options
    const interval = this.element.interval || this.forecast.interval
    // These ones can be 0 take care the way the test is written
    const lowerLimit = (_.has(this.element, 'lowerLimit') ? this.element.lowerLimit : this.forecast.lowerLimit)
    const upperLimit = (_.has(this.element, 'upperLimit') ? this.element.upperLimit : this.forecast.upperLimit)
    // Compute nearest run T0
    let runTime = this.getNearestRunTime(datetime)
    // We don't care about the past, however a forecast is still potentially valid at least until we reach the next one
    let lowerTime = datetime.clone().subtract({ seconds: interval })
    let times = []
    // Check for each forecast step if update is required
    for (let timeOffset = lowerLimit; timeOffset <= upperLimit; timeOffset += interval) {
      let forecastTime = runTime.clone().add({ seconds: timeOffset })
      let discard = false
      if (!this.forecast.keepPastForecasts) {
        discard = forecastTime.isBefore(lowerTime)
      }
      if (!discard) {
        try {
          times.push(await this.harvestForecastTime(datetime, runTime, forecastTime))
        } catch (error) {
          // This catch does not rethrow the error so that the update process will not stop and we try the next time
        }
      }
    }
    // Aggregate tiles to generate timeseries if anabled and tiling as well
    if (this.forecast.tileResolution && this.forecast.timeseries) {
      this.aggregateTiles()
    }
    return times
  },

  async updateForecastData () {
    // Avoid stacking updates
    if (this.updateRunning) {
      logger.info('Skipping forecast data update on ' + this.forecast.name + '/' + this.element.name + ' as previous one is not yet finished')
      return
    }
    this.updateRunning = true
    logger.info('Checking for up-to-date forecast data on ' + this.forecast.name + '/' + this.element.name)
    // Make sure we've got somewhere to put data and clean it up if we only use file as a temporary data store
    let dataDir = this.getDataDirectory()
    if (this.element.dataStore === 'fs') {
      fs.ensureDirSync(dataDir)
    } else {
      fs.emptyDirSync(dataDir)
    }
    const now = moment.utc()
    // Try data refresh for current time
    try {
      let times = await this.refreshForecastData(now)
      logger.info('Completed forecast data update on ' + this.forecast.name + '/' + this.element.name)
      this.updateRunning = false
      return times
    } catch (error) {
      logger.error('Forecast data update on ' + this.forecast.name + '/' + this.element.name + ' failed')
      this.updateRunning = false
      throw error
    }
  }
}
