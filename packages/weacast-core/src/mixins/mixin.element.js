import fs from 'fs-extra'
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
    let promise = new Promise((resolve, reject) => {
      this.gfs.openDownloadStreamByName(filePath)
      .pipe(fs.createWriteStream(filePath))
      .on('error', error => {
        logger.error('Unable to read ' + filePath + ' from GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
        reject(error)
      })
      .on('finish', _ => {
        logger.verbose('Read ' + filePath + ' from GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
        resolve()
      })
    })

    return promise
  },

  saveToGridFS (filePath) {
    let promise = new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
      .pipe(this.gfs.openUploadStream(filePath))
      .on('error', error => {
        logger.error('Unable to write file ' + filePath + ' to GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast', error)
        reject(error)
      })
      .on('finish', _ => {
        logger.verbose('Written file ' + filePath + ' to GridFS for ' + this.forecast.name + '/' + this.element.name + ' forecast')
        resolve()
      })
    })

    return promise
  },

  removeFromGridFS (filePath) {
    let promise = new Promise((resolve, reject) => {
      this.gfs.find({ filename: filePath }).then((error, items) => {
        if (error) reject(error)
        if (items.length > 0) resolve(this.gfs.delete(items[0]._id))
        else resolve()
      })
    })

    return promise
  }

}
