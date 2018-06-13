import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from 'weacast-core'
import arpege from '../src'

describe('weacast-arpege', () => {
  let app, service

  before(() => {
    chailint(chai, util)

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof arpege).to.equal('function')
  })

  it('registers the element services', () => {
    expect(typeof arpege).to.equal('function')
    app.configure(core)
    app.configure(arpege)
    service = app.getService('arpege-world/temperature')
    expect(service).toExist()
  })

  it('performs the element download process', () => {
    // Clear any previous data
    service.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return service.updateForecastData()
    .then(_ => {
      let files = fs.readdirSync(service.getDataDirectory())
      expect(files.length).to.equal(6)
      expect(files.filter(item => path.extname(item) === '.json').length).to.equal(3)
      expect(files.filter(item => path.extname(item) === '.tiff').length).to.equal(3)
    })
  })
  // Let enough time to download a couple of data
  .timeout(60000)

  // Cleanup
  after(() => {
    app.getService('forecasts').Model.drop()
    service.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
