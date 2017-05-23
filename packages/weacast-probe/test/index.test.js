import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from '../src'

describe('weacast-probe', () => {
  let app, uService, vService, probeService, probeResultService, probeId, probeFeatures

  before(() => {
    chailint(chai, util)
    chai.use(spies)

    app = weacast()
    return app.db.connect()
    .then(_ => {
      // Disable TTL because we keep past forecast times so that the number of forecasts is predictable for tests
      // but otherwise MongoDB will remove them automatically
      app.db._db.executeDbAdminCommand( { setParameter: 1, ttlMonitorEnabled: false } )
    })
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
    // download both elements in parallel
    return Promise.all([
      uService.updateForecastData('once'),
      vService.updateForecastData('once')
    ])
  })
  // Let enough time to download a couple of data
  .timeout(30000)
  
  it('performs probing element on-demand', () => {
    let spyProbe = chai.spy.on(probeService, 'probeForecastTime')
    let spyUpdate = chai.spy.on(probeService, 'updateFeaturesInDatabase')
    let geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['u-wind', 'v-wind']
    })
    return uService.find({ paginate: false })
    .then(forecasts => {
      // We should have 2 forecast times
      expect(forecasts.length).to.equal(2)
      return probeService.create(geojson, { query: { forecastTime: forecasts[0].forecastTime } })
    })
    .then(data => {
      expect(spyProbe).to.have.been.called()
      expect(spyUpdate).not.to.have.been.called()
      // 3 features with data for the forecast times
      expect(data.features.length).to.equal(3)
      data.features.forEach(feature => {
        expect(feature.properties['u-wind']).toExist()
        expect(feature.properties['v-wind']).toExist()
        // Test if derived direction values are also present
        expect(feature.properties['windDirection']).toExist()
        expect(feature.properties['windSpeed']).toExist()
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

  it('performs probing stream on element', () => {
    let spyProbe = chai.spy.on(probeService, 'probeForecastTime')
    let spyUpdate = chai.spy.on(probeService, 'updateFeaturesInDatabase')
    let geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['u-wind', 'v-wind']
    })
    return probeService.create(geojson)
    .then(data => {
      probeId = data._id
      expect(spyProbe).to.have.been.called()
      expect(spyUpdate).to.have.been.called()
      return probeResultService.find({ paginate: false, query: { probeId: probeId } })
    })
    .then(features => {
      // 3 features over 2 forecast times
      expect(features.length).to.equal(6)
      features.forEach(feature => {
        expect(feature.properties['u-wind']).toExist()
        expect(feature.properties['v-wind']).toExist()
        // Test if derived direction values are also present
        expect(feature.properties['windDirection']).toExist()
        expect(feature.properties['windSpeed']).toExist()
      })
      // Keep track of the features
      probeFeatures = features
    })
    /* For debug purpose only
    .then(data => {
      fs.outputJsonSync(path.join(__dirname, 'data', 'runways-probe.geojson'), data.layer)
    })
    */
  })

  it('performs probing element on forecast update', () => {
    let spyProbe = chai.spy.on(probeService, 'probeForecastTime')
    let spyUpdate = chai.spy.on(probeService, 'updateFeaturesInDatabase')
    return uService.Model.drop()
    .then(_ => {
      return uService.updateForecastData('once')
    })
    .then(_ => {
      return probeResultService.find({ paginate: false, query: { probeId: probeId } })
    })
    .then(features => {
      expect(spyProbe).to.have.been.called()
      expect(spyUpdate).to.have.been.called()
      // Test we do not have generated new results
      expect(features.length).to.equal(6)
      features.forEach(feature => {
        expect(probeFeatures.find(element => element._id === feature._id)).toExist()
      })
    })
  })
  // Let enough time to download a couple of data
  .timeout(30000)

  it('performs probing results removal on probe removal', () => {
    return probeService.remove(probeId)
    .then(data => {
      return probeResultService.find({
        query: {
          probeId: probeId
        }
      })
    })
    .then(response => {
      // Nothing should remain
      expect(response.data.length).to.equal(0)
    })
  })

  // Cleanup
  after(() => {
    app.getService('forecasts').Model.drop()
    probeService.Model.drop()
    probeResultService.Model.drop()
    uService.Model.drop()
    vService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})

