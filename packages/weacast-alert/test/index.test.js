import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from 'weacast-probe'
import alert from '../src'

describe('weacast-alert', () => {
  let app, uService, vService, probeService, probeResultService, alertService,
    geojson, probeId, spyAlert

  before(() => {
    chailint(chai, util)
    chai.use(spies)
    geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['u-wind', 'v-wind']
    })

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof probe).to.equal('function')
  })

  it('registers the alerts service', () => {
    app.configure(core)
    app.configure(arpege)
    app.configure(probe)
    uService = app.getService('arpege-world/u-wind')
    expect(uService).toExist()
    vService = app.getService('arpege-world/v-wind')
    expect(vService).toExist()
    probeService = app.getService('probes')
    expect(probeService).toExist()
    probeResultService = app.getService('probe-results')
    expect(probeResultService).toExist()
    app.configure(alert)
    alertService = app.getService('alerts')
    expect(alertService).toExist()
    spyAlert = chai.spy.on(alertService, 'checkAlert')
  })
  // Let enough time to process
  .timeout(5000)

  it('performs element download process', () => {
    // Clear any previous data
    uService.Model.remove()
    vService.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))
    // download both elements in parallel
    return Promise.all([
      uService.updateForecastData(),
      vService.updateForecastData()
    ])
  })
  // Let enough time to download a couple of data
  .timeout(30000)

  it('performs probing', () => {
    return probeService.create(geojson)
    .then(data => {
      probeId = data._id
    })
  })

  it('performs alerting on probes', () => {
    return alertService.create({})
    .then(alert => {
      expect(spyAlert).to.have.been.called()
      spyAlert.reset()
    })
  })

  // Cleanup
  after(() => {
    app.getService('forecasts').Model.drop()
    probeService.removeAllListeners()
    probeService.Model.drop()
    probeResultService.Model.drop()
    alertService.Model.drop()
    uService.Model.drop()
    vService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
