
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

  it('registers the log options', () => {
    let log = 'This is a log test'
    let now = new Date()
    logger.info(log)
    let logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
    // expect(fs.existsSync(logFilePath)).to.equal(true)
    let content = fs.readFileSync(logFilePath)
    expect(content.includes(log)).to.equal(true)
  })
})
