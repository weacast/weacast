import fs from 'fs-extra'
import logger from 'winston'

/*
  Round hours to expected interval, e.g. we're currently using 6 hourly interval i.e. 00 || 06 || 12 || 18
  @return {string}
 */
function roundHours (hours, interval) {
  return (Math.floor(hours / interval) * interval)
}

export default {

  getNearestRunTime (datetime) {
    // Compute nearest run T0
    return datetime.clone().hours(roundHours(datetime.hours(), this.forecast.runInterval / 3600)).minutes(0).seconds(0).milliseconds(0)
  },

  getNearestForecastTime (datetime) {
    const interval = this.element.interval || this.forecast.interval
    // Compute nearest forecast T0
    let offsetDateTime = datetime.clone().add({ seconds: 0.5 * interval })
    return datetime.clone().hours(roundHours(offsetDateTime.hours(), interval / 3600)).minutes(0).seconds(0).milliseconds(0)
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
