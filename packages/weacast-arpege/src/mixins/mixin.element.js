import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import request from 'request'
import gtiff2json from 'gtiff2json'
import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-arpege')

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
    // Compute nearest forecast T0
    let offsetDateTime = datetime.clone().add({ seconds: 0.5 * this.forecast.interval })
    return datetime.clone().hours(roundHours(offsetDateTime.hours(), this.forecast.interval / 3600)).minutes(0).seconds(0).milliseconds(0)
  }
  
}
