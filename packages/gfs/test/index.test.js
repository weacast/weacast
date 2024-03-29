import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from '@weacast/core'
import gfs from '../src/index.js'

describe('weacast-gfs', () => {
  let app, service

  before(() => {
    chailint(chai, util)

    app = weacast()
    return app.db.connect()
  })

  it('is ES module compatible', () => {
    expect(typeof gfs).to.equal('function')
  })

  it('registers the element services', async () => {
    expect(typeof gfs).to.equal('function')
    await app.configure(core)
    await app.configure(gfs)
    service = app.getService('gfs-world/temperature')
    expect(service).toExist()
  })

  it('performs the element download process', () => {
    // Clear any previous data
    service.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return service.updateForecastData()
      .then(_ => {
        const files = fs.readdirSync(service.getDataDirectory())
        expect(files.length).to.equal(6)
        expect(files.filter(item => path.extname(item) === '.json').length).to.equal(3)
        expect(files.filter(item => path.extname(item) === '.grib').length).to.equal(3)
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
