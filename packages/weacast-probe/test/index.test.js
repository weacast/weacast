import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { weacast } from 'weacast-core'
import arpege from 'weacast-arpege'
import probe from '../src'

describe('weacast-probe', () => {
  let app, elementService, probeService, probeResultService

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
    elementService = app.getService('arpege-world/temperature')
    expect(elementService).toExist()
    app.configure(probe)
    probeService = app.getService('probes')
    expect(probeService).toExist()
    probeResultService = app.getService('probe-results')
    expect(probeResultService).toExist()
  })
  
  it('performs element download process', () => {
    // Clear any previous data
    elementService.Model.remove()
    fs.emptyDirSync(app.get('forecastPath'))

    return elementService.updateForecastData('once')
  })
  // Let enough time to download a couple of data
  .timeout(30000)
  

  it('performs probing element', () => {
    let geojson = fs.readJsonSync(path.join(__dirname, 'data', 'runways.geojson'))
    Object.assign(geojson, {
      forecast: 'arpege-world',
      elements: ['temperature']
    })
    return probeService.create(geojson)
    .then(data => {
      return probeResultService.find({
        query: {
          'forecast': 'arpege-world'
        }
      })
      .then(response => {
        response.data.forEach(result => {
          result.features.forEach(feature => {
            expect(feature.properties[elementService.element.name]).toExist()
          })
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
    return elementService.Model.drop()
    .then(_ => {
      return elementService.updateForecastData('once')
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
    elementService.Model.drop()
    fs.removeSync(app.get('forecastPath'))
  })
})
