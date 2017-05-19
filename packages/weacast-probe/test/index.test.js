import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from '../src'

describe('weacast-probe', () => {
  let app, uService, vService, probeService, probeResultService, probeId

  before(() => {
    chailint(chai, util)
    chai.use(spies)

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof probe).to.equal('function')
  })

  it('registers the probes service', () => {
    app.configure(core)
    app.configure(arpege)
    uService = app.getService('arpege-world/u-wind')
    expect(uService).toExist()
    vService = app.getService('arpege-world/v-wind')
    expect(vService).toExist()
    app.configure(probe)
    probeService = app.getService('probes')
    expect(probeService).toExist()
    probeResultService = app.getService('probe-results')
    expect(probeResultService).toExist()
  })
  
  it('performs element download process', () => {
    // Clear any previous data
    uService.Model.remove()
    vService.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return uService.updateForecastData('once')
    .then(_ => {
      return vService.updateForecastData('once')
    })
  })
  // Let enough time to download a couple of data
  .timeout(30000)
  

  it('performs probing element', () => {
    let geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['u-wind', 'v-wind']
    })
    return probeService.create(geojson)
    .then(data => {
      probeId = data._id
      return probeResultService.find({
        query: {
          probeId: probeId
        }
      })
      .then(response => {
        // 3 features over 2 forecast times
        expect(response.data.length).to.equal(6)
        response.data.forEach(feature => {
          expect(feature.properties['u-wind']).toExist()
          expect(feature.properties['v-wind']).toExist()
        })
      })
    })
    /* For debug purpose only
    .then(data => {
      fs.outputJsonSync(path.join(__dirname, 'data', 'runways-probe.geojson'), data.layer)
    })
    */
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('performs probing element on forecast update', () => {
    let spy = chai.spy.on(probeService, 'probeForecastTime')
    return uService.Model.drop()
    .then(_ => {
      return uService.updateForecastData('once')
    })
    .then(data => {
      expect(spy).to.have.been.called()
    })
    /* For debug purpose only
    .then(data => {
      fs.outputJsonSync(path.join(__dirname, 'data', 'runways-probe.geojson'), data.layer)
    })
    */
  })
  // Let enough time to download a couple of data
  .timeout(30000)

  // Cleanup
  after(() => {
    probeService.Model.drop()
    probeResultService.Model.drop()
    uService.Model.drop()
    vService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
