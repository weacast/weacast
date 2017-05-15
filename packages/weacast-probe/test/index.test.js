import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast, Database } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from '../src'

describe('weacast-probe', () => {
  let app, elementService, probeService

  before(() => {
    chailint(chai, util)

    app = weacast()
    app.db = Database.create(app)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof probe).to.equal('function')
  })

  it('registers the probes service', () => {
    app.configure(core)
    app.configure(arpege)
    elementService = app.getService('arpege-world/temperature')
    expect(elementService).toExist()
    app.configure(probe)
    probeService = app.getService('probes')
    expect(probeService).toExist()
  })

  it('performs element download process', () => {
    // Clear any previous data
    elementService.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return elementService.updateForecastData('once')
  })
  // Let enough time to download a couple of data
  .timeout(60000)

  it('performs probing element', () => {
    let geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    geojson.properties = {
      elements: ['temperature']
    }
    return probeService.create({
      layer: geojson
    })
  })

  // Cleanup
  after(() => {
    probeService.Model.drop()
    elementService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
