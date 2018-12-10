
import path from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import moment from 'moment'
import core, { weacast } from '../src'
import { getNearestRunTime, getNearestForecastTime } from '../src/common'

describe('weacast-core', () => {
  let app

  before(() => {
    chailint(chai, util)

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('rounds run/forecast times', () => {
    let date = moment.utc('2018-11-07T14:07:23.847Z')
    let runDate = getNearestRunTime(date, 3600 * 6)
    expect(runDate.format()).to.equal(moment.utc('2018-11-07T12:00:00.000Z').format())
    let forecastDate = getNearestForecastTime(date, 3600 * 1)
    expect(forecastDate.format()).to.equal(moment.utc('2018-11-07T14:00:00.000Z').format())
    date = moment.utc('2018-11-07T23:07:23.847Z')
    runDate = getNearestRunTime(date, 3600 * 6)
    expect(runDate.format()).to.equal(moment.utc('2018-11-07T18:00:00.000Z').format())
    forecastDate = getNearestForecastTime(date, 3600 * 3) // Check day line crossing
    expect(forecastDate.format()).to.equal(moment.utc('2018-11-08T00:00:00.000Z').format())
  })

  it('registers the forecasts service', () => {
    app.configure(core)
    let service = app.getService('forecasts')
    expect(service).toExist()
  })

  it('registers the log options', (done) => {
    let log = 'This is a log test'
    let now = new Date()
    logger.info(log)
    // FIXME: need to let some time to proceed with log file
    // Didn't find a better way since fs.watch() does not seem to work...
    setTimeout(() => {
      let logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
      fs.readFile(logFilePath, 'utf8', (err, content) => {
        expect(err).beNull()
        expect(content.includes(log)).to.equal(true)
        done()
      })
    }, 2500)
  })
  // Let enough time to process
  .timeout(5000)
})
