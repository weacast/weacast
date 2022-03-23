import fs from 'fs-extra'
import path from 'path'
import logger from 'winston'
import { getNearestRunTime, getNearestForecastTime } from '../common'

export default {

  getNearestRunTime (datetime) {
    return getNearestRunTime(datetime, this.forecast.runInterval)
  },

  getNearestForecastTime (datetime) {
    const interval = this.element.interval || this.forecast.interval
    return getNearestForecastTime(datetime, interval)
  },

  isExternalDataStorage () {
    return ((this.element.dataStore === 'fs') || (this.element.dataStore === 'gridfs'))
  },

  readFromGridFS (filePath) {
    const outputPath = (path.isAbsolute(filePath)
      ? filePath
      : path.join(this.app.get('forecastPath'), filePath))
    // Make sure we've got somewhere to put data
    fs.ensureDirSync(path.dirname(outputPath))

    return new Promise((resolve, reject) => {
      this.gfs.openDownloadStreamByName(filePath)
        .pipe(fs.createWriteStream(outputPath))
        .on('error', error => {
          logger.error('Unable to read ' + filePath + ' from GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
          reject(error)
        })
        .on('finish', _ => {
          logger.verbose('Read ' + filePath + ' from GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
          resolve()
        })
    })
  },

  saveToGridFS (filePath, metadata) {
    const inputPath = (path.isAbsolute(filePath)
      ? filePath
      : path.join(this.app.get('forecastPath'), filePath))

    return new Promise((resolve, reject) => {
      fs.createReadStream(inputPath)
        .pipe(this.gfs.openUploadStream(filePath, { metadata }))
        .on('error', error => {
          logger.error('Unable to write file ' + filePath + ' to GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast', error)
          reject(error)
        })
        .on('finish', _ => {
          logger.verbose('Written file ' + filePath + ' to GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
          resolve()
        })
    })
  },

  async removeFromGridFS (filePath) {
    const items = await this.gfs.find({ filename: filePath }).toArray()
    return (items.length > 0 ? this.gfs.delete(items[0]._id) : undefined)
  },

  async cleanGridFS (datetime) {
    const interval = this.element.interval || this.forecast.interval
    const items = await this.gfs.find({
      'metadata.forecastTime': { $lte: datetime.clone().subtract(interval, 'seconds').toDate() }
    }).toArray()
    await Promise.all(items.map(item => this.gfs.delete(item._id)))
  }

}
