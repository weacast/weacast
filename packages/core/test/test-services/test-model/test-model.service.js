import path from 'path'
import fs from 'fs-extra'

export default {

  async convertForecastTime (runTime, forecastTime) {
    if (this.throwOnConvert) {
      // We throw only once
      this.throwOnConvert = false
      throw new Error('Cannot convert or write file')
    }
    const filePath = this.getForecastTimeFilePath(runTime, forecastTime)
    const convertedFilePath = this.getForecastTimeConvertedFilePath(runTime, forecastTime)
    const json = await fs.readJson(filePath)
    await fs.outputJson(convertedFilePath, json, 'utf8')
    return json
  },

  getForecastTimeFilePath (runTime, forecastTime) {
    return path.join(this.app.get('forecastPath'), this.forecast.name, this.element.name, runTime.format('YYYY-MM-DD[_]HH-mm-ss') + '_' + forecastTime.format('YYYY-MM-DD[_]HH-mm-ss') + '.data')
  },

  getForecastTimeRequest (runTime, forecastTime) {
    // Just to test the download process use a web site that will be mocked
    return {
      url: 'https://www.elements.com',
      timeout: 5000
    }
  }
}
