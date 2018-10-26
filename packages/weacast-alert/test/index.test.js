import path from 'path'
import utility from 'util'
import fs from 'fs-extra'
import moment from 'moment'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from 'weacast-probe'
import alert from '../src'

describe('weacast-alert', () => {
  let app, uService, vService, probeService, probeResultService, alertService,
    geojson, probeId, probeAlert, spyRegisterAlert, spyUnregisterAlert, spyCheckAlert
  let activeCount = 0
  let eventCount = 0

  function checkAlertEvent (event) {
    const { alert, triggers } = event
    eventCount++
    if (alert.status.active) {
      activeCount++
      expect(triggers).toExist()
      expect(triggers.length > 0).beTrue()
      expect(triggers[0].geometry).toExist()
    } else {
      expect(triggers).beUndefined()
    }
  }

  function resetAlertEvent () {
    activeCount = 0
    eventCount = 0
  }

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
    alertService.on('alerts', checkAlertEvent)
    spyRegisterAlert = chai.spy.on(alertService, 'registerAlert')
    spyUnregisterAlert = chai.spy.on(alertService, 'unregisterAlert')
    spyCheckAlert = chai.spy.on(alertService, 'checkAlert')
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
    // await utility.promisify(setTimeout)(5000)
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('creates active alert on probes', async () => {
    const now = moment.utc()
    probeAlert = await alertService.create({
      cron: '*/5 * * * * *',
      // expireAt: now.add({ days: 1 }), // This is default expiration
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: [ 'windSpeed' ],
      conditions: {
        geometry: {
          $geoWithin: {
            // 1 meter around so that no feature except the target one should be covered, convert approximately in radians,
            // see https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
            $centerSphere: [ geojson.features[0].geometry.coordinates, 1.0 / 3963.2 ]
          }
        },
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.once()
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.twice()
    spyCheckAlert.reset()
    expect(eventCount).to.equal(2)
    expect(activeCount).to.equal(2)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beTrue()
    expect(results[0].status.triggeredAt).toExist()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.triggeredAt.isAfter(now)).beTrue()
    expect(results[0].status.checkedAt.isAfter(results[0].status.triggeredAt)).beTrue()
    resetAlertEvent()
  })
  // Let enough time to download a couple of data
  .timeout(15000)

  it('removes active alert on probes', async () => {
    await alertService.remove(probeAlert._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.once()
    spyUnregisterAlert.reset()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('creates inactive alert on probes', async () => {
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
        windSpeed: { $lt: -10 } // Set an invalid range so that we are sure it will not trigger
      }
    })
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.twice()
    spyCheckAlert.reset()
    expect(eventCount).to.equal(2)
    expect(activeCount).to.equal(0)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beFalse()
    expect(results[0].status.triggeredAt).beUndefined()
    expect(results[0].status.checkedAt).toExist()
    await alertService.remove(probeAlert._id.toString())
    resetAlertEvent()
  })
  // Let enough time to download a couple of data
  .timeout(15000)

  it('creates expiring alert on probes', async () => {
    const now = moment.utc()
    probeAlert = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.add({ seconds: 7 }),
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: [ 'windSpeed' ],
      conditions: {
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      }
    })
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron should have been called three times
    await utility.promisify(setTimeout)(15000)
    // Check due to expiration it has actually been called twice
    expect(spyCheckAlert).to.have.been.called.twice()
    spyCheckAlert.reset()
    expect(eventCount).to.equal(1)
    expect(activeCount).to.equal(1)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    resetAlertEvent()
  })
  // Let enough time to download a couple of data
  .timeout(20000)

  // Cleanup
  after(() => {
    app.getService('forecasts').Model.drop()
    probeService.removeAllListeners()
    alertService.removeAllListeners()
    probeService.Model.drop()
    probeResultService.Model.drop()
    alertService.Model.drop()
    uService.Model.drop()
    vService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
