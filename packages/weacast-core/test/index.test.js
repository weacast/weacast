
import path from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from '../src'

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
