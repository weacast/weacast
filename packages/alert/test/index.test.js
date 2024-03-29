import path from 'path'
import { fileURLToPath } from 'url'
import utility from 'util'
import fs from 'fs-extra'
import moment from 'moment'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import gfs from '@weacast/gfs'
import core, { weacast } from '@weacast/core'
import probe from '@weacast/probe'
import alert from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('weacast-alert', () => {
  let app, uService, vService, probeService, probeResultService, alertService,
    geojson, probeId, alertObject, spyRegisterAlert, spyUnregisterAlert, spyCheckAlert
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
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind'],
      featureId: ['properties.Airport', 'properties.Ident', 'properties.RevCode']
    })

    app = weacast()
    return app.db.connect()
  })

  it('is ES module compatible', () => {
    expect(typeof probe).to.equal('function')
  })

  it('registers the alerts service', async () => {
    await app.configure(core)
    await app.configure(gfs)
    await app.configure(probe)
    uService = app.getService('gfs-world/u-wind')
    expect(uService).toExist()
    vService = app.getService('gfs-world/v-wind')
    expect(vService).toExist()
    probeService = app.getService('probes')
    expect(probeService).toExist()
    probeResultService = app.getService('probe-results')
    expect(probeResultService).toExist()
    await app.configure(alert)
    alertService = app.getService('alerts')
    expect(alertService).toExist()
    alertService.on('alerts', checkAlertEvent)
    spyRegisterAlert = chai.spy.on(alertService, 'registerAlert')
    spyUnregisterAlert = chai.spy.on(alertService, 'unregisterAlert')
    spyCheckAlert = chai.spy.on(alertService, 'checkAlert')
  })
  // Let enough time to process
    .timeout(10000)

  it('creates probe', async () => {
    const data = await probeService.create(geojson)
    probeId = data._id
    // Wait long enough to be sure the results are here
    // await utility.promisify(setTimeout)(5000)
  })
  // Let enough time to process
    .timeout(10000)

  it('performs element download process and probing', async () => {
    // Clear any previous data
    uService.Model.remove()
    vService.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))
    // download both elements in parallel
    await Promise.all([
      uService.updateForecastData(),
      vService.updateForecastData()
    ])
    /*
    let results = await probeResultService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(4)
    */
  })
  // Let enough time to download a couple of data
    .timeout(60000)

  it('creates active alert on-demand at specific location', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      // expireAt: now.add({ days: 1 }), // This is default expiration
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind', 'windSpeed'],
      conditions: {
        geometry: {
          type: 'Point',
          coordinates: geojson.features[0].geometry.coordinates
        },
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.exactly(1)
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeCount).to.be.at.least(2)
    resetAlertEvent()
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beTrue()
    expect(results[0].status.triggeredAt).toExist()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.triggeredAt.isSameOrAfter(now.format())).beTrue() // Registering trigger a check
    expect(results[0].status.checkedAt.isSameOrAfter(results[0].status.triggeredAt.format())).beTrue()
  })
  // Let enough time to process
    .timeout(15000)

  it('removes active alert on-demand', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.exactly(1)
    spyUnregisterAlert.reset()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('creates inactive alert on-demand at specific location', async () => {
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      // expireAt: now.add({ days: 1 }), // This is default expiration
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      forecast: 'gfs-world',
      elements: ['u-wind', 'v-wind', 'windSpeed'],
      conditions: {
        geometry: {
          type: 'Point',
          coordinates: geojson.features[0].geometry.coordinates
        },
        windSpeed: { $lt: -10 } // Set an invalid range so that we are sure it will not trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.exactly(1)
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeCount).to.equal(0)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beFalse()
    expect(results[0].status.triggeredAt).beUndefined()
    expect(results[0].status.checkedAt).toExist()
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.exactly(1)
    spyUnregisterAlert.reset()
    resetAlertEvent()
  })
  // Let enough time to process
    .timeout(15000)

  it('creates active alert on probes', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      // expireAt: now.add({ days: 1 }), // This is default expiration
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: ['windSpeed'],
      conditions: {
        geometry: {
          $geoWithin: {
            // 1 meter around so that no feature except the target one should be covered, convert approximately in radians,
            // see https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
            $centerSphere: [geojson.features[0].geometry.coordinates, 1.0 / 6378137.0]
          }
        },
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.exactly(1)
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeCount).to.be.at.least(2)
    resetAlertEvent()
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beTrue()
    expect(results[0].status.triggeredAt).toExist()
    expect(results[0].status.checkedAt).toExist()
    expect(results[0].status.triggeredAt.isSameOrAfter(now.format())).beTrue() // Registering trigger a check
    expect(results[0].status.checkedAt.isSameOrAfter(results[0].status.triggeredAt.format())).beTrue()
  })
  // Let enough time to process
    .timeout(15000)

  it('removes active alert on probes', async () => {
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.exactly(1)
    spyUnregisterAlert.reset()
    const results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
    // Wait long enough to be sure the cron has not been called again (alert unregistered)
    await utility.promisify(setTimeout)(5000)
    expect(spyCheckAlert).to.not.have.been.called()
    spyCheckAlert.reset()
  })
  // Let enough time to process
    .timeout(10000)

  it('creates inactive alert on probes', async () => {
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: ['windSpeed'],
      conditions: {
        windSpeed: { $lt: -10 } // Set an invalid range so that we are sure it will not trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.exactly(1)
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron has been called twice
    await utility.promisify(setTimeout)(10000)
    expect(spyCheckAlert).to.have.been.called.at.least(2)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.least(2)
    expect(activeCount).to.equal(0)
    resetAlertEvent()
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    expect(results[0].status).toExist()
    expect(results[0].status.active).beFalse()
    expect(results[0].status.triggeredAt).beUndefined()
    expect(results[0].status.checkedAt).toExist()
    await alertService.remove(alertObject._id.toString())
    expect(spyUnregisterAlert).to.have.been.called.exactly(1)
    spyUnregisterAlert.reset()
  })
  // Let enough time to process
    .timeout(15000)

  it('creates expiring alert on probes', async () => {
    const now = moment.utc()
    alertObject = await alertService.create({
      cron: '*/5 * * * * *',
      expireAt: now.clone().add({ seconds: 7 }),
      probeId,
      featureId: geojson.featureId,
      period: {
        start: { hours: -6 },
        end: { hours: 6 }
      },
      elements: ['windSpeed'],
      conditions: {
        windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
      }
    })
    expect(spyRegisterAlert).to.have.been.called.exactly(1)
    spyRegisterAlert.reset()
    let results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(1)
    // Wait long enough to be sure the cron should have expired
    await utility.promisify(setTimeout)(10000)
    // Check due to expiration it has actually been called at most three times
    // Indeed the last check might be the one that detect the expîration
    expect(spyCheckAlert).to.have.been.called.at.most(3)
    spyCheckAlert.reset()
    expect(eventCount).to.be.at.most(2)
    expect(activeCount).to.be.at.most(2)
    resetAlertEvent()
    // Wait long enough to be sure the TTL monitor has ran
    await utility.promisify(setTimeout)(60000)
    results = await alertService.find({ paginate: false, query: {} })
    expect(results.length).to.equal(0)
  })
  // Let enough time to process
    .timeout(100000)

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
