import path from 'path'
import fs from 'fs-extra'

export default {

  convertForecastTime (runTime, forecastTime) {
    let promise = new Promise((resolve, reject) => {
      const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
      let json = [0, 1, 1, 0]
      fs.outputJson(convertedFilePath, json, 'utf8')
      .then(_ => {
        resolve(json)
      })
      .catch(error => {
        reject(error)
      })
    })

    return promise
  },

  getForecastTimeFilePath (runTime, forecastTime) {
    return path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name, runTime.format('YYYY-MM-DD[_]HH-mm-ss') + '_' + forecastTime.format('YYYY-MM-DD[_]HH-mm-ss') + '.html')
  },

  getForecastTimeRequest (runTime, forecastTime) {
    // Just to test the download process use a web site that is almost never down
    return {
      url: 'http://google.com'
    }
  }
}
