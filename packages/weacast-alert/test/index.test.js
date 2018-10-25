import path from 'path'
import utility from 'util'
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
    geojson, probeId, probeAlert, spyAlert

  before(() => {
    chailint(chai, util)
    chai.use(spies)
    geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['u-wind', 'v-wind'],
      featureId: ['properties.Airport', 'properties.Ident', 'properties.RevCode']
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

  it('performs element download process', async () => {
    // download both elements in parallel
    await Promise.all([
      uService.updateForecastData(),
      vService.updateForecastData()
    ])
  })
  // Let enough time to download a couple of data
  .timeout(30000)

  it('performs probing', async () => {
    const data = await probeService.create(geojson)
    probeId = data._id
    // Wait long enough to be sure the results are here
    //await utility.promisify(setTimeout)(5000)
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('creates alert on probes', async () => {
    probeAlert = await alertService.create({
      cron: '*/5 * * * * *',
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: [ 'windSpeed' ],
      conditions: {
        windSpeed: { gte: 0, lte: 10 }
      }
    })
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called once
    await utility.promisify(setTimeout)(10000)
    expect(spyAlert).to.have.been.called()
    spyAlert.reset()
  })
  // Let enough time to download a couple of data
  .timeout(20000)

  it('removes alert on probes', async () => {
    await alertService.remove(probeAlert._id.toString())
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again
    await utility.promisify(setTimeout)(10000)
    expect(spyAlert).to.not.have.been.called()
    spyAlert.reset()
  })
  // Let enough time to download a couple of data
  .timeout(20000)

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
