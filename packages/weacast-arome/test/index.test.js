import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from 'weacast-core'
import arome from '../src'

describe('weacast-arome', () => {
  let app, service

  before(() => {
    chailint(chai, util)

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof arome).to.equal('function')
  })

  it('registers the element services', () => {
    expect(typeof arome).to.equal('function')
    app.configure(core)
    app.configure(arome)
    service = app.getService('arome-france/temperature')
    expect(service).toExist()
  })

  it('performs the element download process', () => {
    // Clear any previous data
    service.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return service.updateForecastData('once')
    .then(_ => {
      let files = fs.readdirSync(service.getDataDirectory())
      expect(files.length).to.equal(8)
      expect(files.filter(item => path.extname(item) === '.json').length).to.equal(4)
      expect(files.filter(item => path.extname(item) === '.tiff').length).to.equal(4)
    })
  })
  // Let enough time to download a couple of data
  .timeout(60000)

  // Cleanup
  after(() => {
    service.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
