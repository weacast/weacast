import path from 'path'
import fs from 'fs-extra'
import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { Database, createElementService } from '../src'

describe('weacast-core', () => {
  let app, service
  let forecast = {
    name: 'test-forecast',
    model: 'test-model',
    size: [2, 2],
    runInterval: 6 * 3600,          // Produced every 6h
    oldestRunInterval: 6 * 3600,    // Don't go back in time older than 6h
    interval: 3 * 3600,             // Steps of 3h
    lowerLimit: 0 * 3600,           // From T0+3h
    upperLimit: 6 * 3600,           // Up to T0+6h
  }
  let element = {
    name: 'test-element',
    dataStore: 'fs'
  }

  before(() => {
    chailint(chai, util)

    app = feathers()
    app.configure(configuration())
    app.configure(hooks())
    app.db = Database.create(app)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof createElementService).to.equal('function')
  })

  it('registers the element service', () => {
    app.configure(core)
    service = createElementService(forecast, element, app, path.join(__dirname, 'test-services'))
    expect(service).toExist()
    // Test as well if correctly registered into app
    service = app.service('test-forecast/test-element')
    expect(service).toExist()
  })

  it('performs the element download process', () => {
    // Clear any previous data
    service.Model.remove()
    fs.emptyDirSync(service.getDataDirectory())

    return service.updateForecastData()
    .then( _ => {
      let files = fs.readdirSync(service.getDataDirectory())
      expect(files.length).to.equal(6)
      expect(files.filter(item => path.extname(item) === '.json').length).to.equal(3)
      expect(files.filter(item => path.extname(item) === '.html').length).to.equal(3)
    })
  })

  it('stores element in DB', () => {
    return service.find()
    .then( response => {
      expect(response.data.length).to.equal(3)
      // Ensure correct data filtering
      expect(response.data[0].runTime).toExist()
      expect(response.data[0].forecastTime).toExist()
      expect(response.data[0].minValue).toExist()
      expect(response.data[0].maxValue).toExist()
      expect(response.data[0].data).to.beUndefined()
    })
  })

  it('queries element in DB', () => {
    return service.find({
      query: {
        time: new Date().toISOString(),
        $select: ['forecastTime', 'data', 'minValue', 'maxValue']
      }
    })
    .then( response => {
      expect(response.data.length).to.equal(1)
      expect(response.data[0].data.length).to.equal(4)
      expect(response.data[0].minValue).to.equal(0)
      expect(response.data[0].maxValue).to.equal(1)
    })
  })

  // Cleanup
  after(() => {
    app.service('test-forecast/test-element').Model.drop()
    fs.removeSync(dataDir)
  })
})
