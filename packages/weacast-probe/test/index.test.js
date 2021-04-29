import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import gfs from 'weacast-gfs'
import probe from '../src'

describe('weacast-probe', () => {
  let app, uService, vService, probeService, probeResultService,
    geojson, probeId, spyProbe, spyUpdate, firstForecastTime, nextForecastTime
  const probeOptions = {
    forecast: 'gfs-world',
    elements: ['u-wind', 'v-wind'],
    featureId: ['properties.Airport', 'properties.Ident', 'properties.RevCode']
  }
  before(() => {
    chailint(chai, util)
    chai.use(spies)
    geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, probeOptions)

    app = weacast()
    return app.db.connect()
    .then(_ => {
      // Disable TTL because we keep past forecast times so that the number of forecasts is predictable for tests
      // but otherwise MongoDB will remove them automatically
      app.db._db.executeDbAdminCommand({ setParameter: 1, ttlMonitorEnabled: false })
    })
  })

  it('is CommonJS compatible', () => {
    expect(typeof probe).to.equal('function')
  })

  it('registers the probes service', async () => {
    app.configure(core)
    await app.configure(gfs)
    uService = app.getService('gfs-world/u-wind')
    expect(uService).toExist()
    vService = app.getService('gfs-world/v-wind')
    expect(vService).toExist()
    app.configure(probe)
    probeService = app.getService('probes')
    expect(probeService).toExist()
    probeResultService = app.getService('probe-results')
    expect(probeResultService).toExist()
    spyProbe = chai.spy.on(probeService, 'probeForecastTime')
    spyUpdate = chai.spy.on(probeService, 'updateFeaturesInDatabase')
  })
  // Let enough time to process
  .timeout(5000)

  it('performs element download process', async () => {
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
  .timeout(60000)

  it('performs probing element on-demand at forecast time', async () => {
    const forecasts = await uService.find({ paginate: false })
    // We should have 2 forecast times
    expect(forecasts.length).to.equal(2)
    firstForecastTime = forecasts[0].forecastTime
    nextForecastTime = firstForecastTime.clone()
    nextForecastTime.add({ hours: 3 })
    const data = await probeService.create(geojson, { query: { forecastTime: firstForecastTime } })

    expect(spyProbe).to.have.been.called()
    expect(spyUpdate).not.to.have.been.called()
    // This will insure spies are properly reset before jumping to next test due to async ops
    spyProbe.reset()
    spyUpdate.reset()
    // 3 features with data for the forecast times
    expect(data.features.length).to.equal(3)
    data.features.forEach(feature => {
      expect(feature.properties['u-wind']).toExist()
      expect(feature.properties['v-wind']).toExist()
      expect(typeof feature.properties['u-wind']).to.equal('number')
      expect(typeof feature.properties['v-wind']).to.equal('number')
      // Test if derived direction values are also present
      expect(feature.properties['windDirection']).toExist()
      expect(feature.properties['windSpeed']).toExist()
      expect(typeof feature.properties['windDirection']).to.equal('number')
      expect(typeof feature.properties['windSpeed']).to.equal('number')
    })
    // For debug purpose only
    // fs.outputJsonSync(path.join(__dirname, 'data', 'runways-probe.geojson'), data.layer)
  })
  // Let enough time to process
  .timeout(10000)

  it('performs probing element on-demand at specific location for forecast time range', async () => {
    const geometry = {
      type: 'Point',
      coordinates: [ 1.5, 43 ]
    }
    const query = {
      forecastTime: {
        $gte: firstForecastTime,
        $lte: nextForecastTime
      },
      geometry: {
        $geoIntersects: {
          $geometry: geometry
        }
      }
    }

    const data = await probeService.create(Object.assign({}, probeOptions), { query })
    expect(data.features.length).to.equal(1)
    const feature = data.features[0]
    expect(spyProbe).to.have.been.called()
    expect(spyUpdate).not.to.have.been.called()
    // This will insure spies are properly reset before jumping to next test due to async ops
    spyProbe.reset()
    spyUpdate.reset()
    expect(feature.forecastTime).toExist()
    expect(feature.forecastTime['u-wind']).toExist()
    expect(feature.forecastTime['v-wind']).toExist()
    expect(feature.forecastTime['u-wind'].length).to.equal(2)
    expect(feature.forecastTime['v-wind'].length).to.equal(2)
    expect(feature.forecastTime['u-wind'][0].isBefore(feature.forecastTime['u-wind'][1])).beTrue()
    expect(feature.forecastTime['v-wind'][0].isBefore(feature.forecastTime['v-wind'][1])).beTrue()
    expect(feature.properties['u-wind']).toExist()
    expect(feature.properties['v-wind']).toExist()
    expect(feature.properties['u-wind'].length).to.equal(2)
    expect(feature.properties['v-wind'].length).to.equal(2)
    expect(typeof feature.properties['u-wind'][0]).to.equal('number')
    expect(typeof feature.properties['v-wind'][0]).to.equal('number')
    expect(typeof feature.properties['u-wind'][1]).to.equal('number')
    expect(typeof feature.properties['v-wind'][1]).to.equal('number')
  })
  // Let enough time to process
  .timeout(10000)

  it('performs probing element on-demand at specific location for forecast time range without aggregation', async () => {
    const geometry = {
      type: 'Point',
      coordinates: [ 1.5, 43 ]
    }
    const query = {
      forecastTime: {
        $gte: firstForecastTime,
        $lte: nextForecastTime
      },
      geometry: {
        $geoIntersects: {
          $geometry: geometry
        }
      },
      aggregate: false
    }

    const data = await probeService.create(Object.assign({}, probeOptions), { query })
    expect(data.features.length).to.equal(2)
    const features = data.features
    expect(spyProbe).to.have.been.called()
    expect(spyUpdate).not.to.have.been.called()
    // This will insure spies are properly reset before jumping to next test due to async ops
    spyProbe.reset()
    spyUpdate.reset()
    expect(features[0].forecastTime).toExist()
    expect(features[1].forecastTime).toExist()
    expect(features[0].forecastTime.isBefore(features[1].forecastTime)).beTrue()
    expect(features[0].forecastTime.isBefore(features[1].forecastTime)).beTrue()
    expect(features[0].properties['u-wind']).toExist()
    expect(features[0].properties['v-wind']).toExist()
    expect(features[1].properties['u-wind']).toExist()
    expect(features[1].properties['v-wind']).toExist()
    expect(typeof features[0].properties['u-wind']).to.equal('number')
    expect(typeof features[0].properties['v-wind']).to.equal('number')
    expect(typeof features[1].properties['u-wind']).to.equal('number')
    expect(typeof features[1].properties['v-wind']).to.equal('number')
  })
  // Let enough time to process
  .timeout(10000)

  it('creates probing stream on element', async () => {
    const data = await probeService.create(geojson)
    probeId = data._id
    // No update on creation
    expect(spyProbe).not.to.have.been.called()
    expect(spyUpdate).not.to.have.been.called()
    // Features filtered on creation
    expect(data.features).beUndefined()
  })

  it('performs probing element on forecast update', (done) => {
    uService.Model.drop()
    .then(_ => uService.updateForecastData())
    // We need to register to results update event to know when to proceed
    let updateCount = 0
    probeService.on('results', async event => {
      if (event.probe._id === probeId) updateCount++
      // 3 features over 2 forecast times
      if (updateCount === 2) {
        expect(spyProbe).to.have.been.called()
        expect(spyUpdate).to.have.been.called()
        // This will insure spies are properly reset before jumping to next test due to async ops
        spyProbe.reset()
        spyUpdate.reset()
        const features = await probeResultService.find({ paginate: false, query: { probeId } })
        // Test we have generated new results
        expect(features.length).to.equal(6)
        features.forEach(feature => {
          expect(feature.properties['u-wind']).toExist()
          expect(feature.properties['v-wind']).toExist()
          expect(typeof feature.properties['u-wind']).to.equal('number')
          expect(typeof feature.properties['v-wind']).to.equal('number')
          // Test if derived direction values are also present
          expect(feature.properties['windDirection']).toExist()
          expect(feature.properties['windSpeed']).toExist()
          expect(typeof feature.properties['windDirection']).to.equal('number')
          expect(typeof feature.properties['windSpeed']).to.equal('number')
        })
        done()
      }
    })
  })
  // Let enough time to download a couple of data
  .timeout(30000)

  it('performs spatial filtering on probe results', async () => {
    let geometry = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: geojson.features[0].geometry.coordinates
        },
        $maxDistance: 10000 // 10 Kms around
      }
    }
    let features = await probeResultService.find({
      paginate: false,
      query: {
        probeId,
        geometry,
        forecastTime: firstForecastTime
      }
    })
    // All features should be covered
    expect(features.length).to.equal(3)
    geometry.$near.$maxDistance = 1 // 1 meter around
    features = await probeResultService.find({
      paginate: false,
      query: {
        probeId,
        geometry,
        forecastTime: firstForecastTime
      }
    })
    // No feature except the target one should be covered
    expect(features.length).to.equal(1)
    geometry.$near.$maxDistance = 10000 // 10 Kms around
    // Check as well using shortcut
    features = await probeResultService.find({
      paginate: false,
      query: {
        probeId,
        longitude: geometry.$near.$geometry.coordinates[0],
        latitude: geometry.$near.$geometry.coordinates[1],
        distance: geometry.$near.$maxDistance,
        forecastTime: firstForecastTime
      }
    })
    // All features should be covered
    expect(features.length).to.equal(3)
    geometry.$near.$maxDistance = 1 // 1 meter around
    features = await probeResultService.find({
      paginate: false,
      query: {
        probeId,
        longitude: geometry.$near.$geometry.coordinates[0],
        latitude: geometry.$near.$geometry.coordinates[1],
        distance: geometry.$near.$maxDistance,
        forecastTime: firstForecastTime
      }
    })
    // No feature except the target one should be covered
    expect(features.length).to.equal(1)
  })

  it('performs element value filtering on probe results', async () => {
    let query = { probeId }
    query['properties.windSpeed'] = { $gt: -1, $lt: 0 }
    let features = await probeResultService.find({
      paginate: false,
      query
    })
    // None should be covered since speed is always >= 0
    expect(features.length).to.equal(0)
    query['properties.windSpeed'] = { $gt: 0, $lt: 99999 }
    features = await probeResultService.find({
      paginate: false,
      query
    })
    // All should be covered sicne speed is always >= 0
    expect(features.length).to.equal(6)
  })

  it('performs element aggregation on probe results for forecast time range', async () => {
    let query = {
      probeId,
      forecastTime: {
        $gte: firstForecastTime,
        $lte: nextForecastTime
      },
      'properties.Ident': 'RW30',
      $groupBy: 'properties.Ident',
      $aggregate: ['windDirection', 'windSpeed']
    }
    let features = await probeResultService.find({
      paginate: false,
      query
    })
    expect(features.length).to.equal(1)
    const feature = features[0]
    expect(feature.forecastTime['windDirection']).toExist()
    expect(feature.forecastTime['windSpeed']).toExist()
    expect(feature.forecastTime['windDirection'].length).to.equal(2)
    expect(feature.forecastTime['windSpeed'].length).to.equal(2)
    expect(feature.forecastTime['windDirection'][0].isBefore(feature.forecastTime['windDirection'][1])).beTrue()
    expect(feature.forecastTime['windSpeed'][0].isBefore(feature.forecastTime['windSpeed'][1])).beTrue()
    expect(feature.properties['windSpeed'].length).to.equal(2)
    expect(feature.properties['windDirection'].length).to.equal(2)
    expect(typeof feature.properties['windDirection'][0]).to.equal('number')
    expect(typeof feature.properties['windSpeed'][0]).to.equal('number')
    expect(typeof feature.properties['windDirection'][1]).to.equal('number')
    expect(typeof feature.properties['windSpeed'][1]).to.equal('number')
  })

  it('performs probing results removal on probe removal', async () => {
    await probeService.remove(probeId)
    const response = await probeResultService.find({ query: { probeId } })
    // Nothing should remain
    expect(response.data.length).to.equal(0)
  })

  // Cleanup
  after(() => {
    app.db._db.executeDbAdminCommand({ setParameter: 1, ttlMonitorEnabled: true })
    app.getService('forecasts').Model.drop()
    probeService.removeAllListeners()
    probeService.Model.drop()
    probeResultService.Model.drop()
    uService.Model.drop()
    vService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
