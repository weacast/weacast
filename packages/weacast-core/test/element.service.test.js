import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from '../src'

describe('weacast-core', () => {
  let app
  let forecast = {
    name: 'test-forecast',
    model: 'test-model',
    size: [2, 2],
    keepPastForecasts: true,        // We will keep past forecast times so that the number of forecasts is predictable for tests
    runInterval: 6 * 3600,          // Produced every 6h
    oldestRunInterval: 6 * 3600,    // Don't go back in time older than 6h
    interval: 3 * 3600,             // Steps of 3h
    lowerLimit: 0 * 3600,           // From T0+3h
    upperLimit: 6 * 3600            // Up to T0+6h
  }
  let dataStores = ['db', 'fs', 'gridfs']
  let services = []

  before(() => {
    chailint(chai, util)

    app = weacast()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof app.createElementService).to.equal('function')
  })

  it('registers the element services', () => {
    app.configure(core)
    services = dataStores.map(dataStore => {
      let service = app.createElementService(forecast, {
        name: 'test-element-' + dataStore,
        dataStore
      }, path.join(__dirname, 'test-services'))
      expect(service).toExist()
      // Test as well if correctly registered into app
      service = app.getService('test-forecast/test-element-' + dataStore)
      expect(service).toExist()
      return service
    })
  })

  it('performs the element download processes', () => {
    let downloadPromises = []
    services.forEach(service => {
      // Clear any previous data
      service.Model.remove()
      fs.emptyDirSync(service.getDataDirectory())
      downloadPromises.push(service.updateForecastData('once'))
    })

    return Promise.all(downloadPromises)
    .then(_ => {
      services.forEach(service => {
        let files = fs.readdirSync(service.getDataDirectory())
        // Check for file persistence
        if (service.element.dataStore === 'fs') {
          expect(files.length).to.equal(6)
          expect(files.filter(item => path.extname(item) === '.json').length).to.equal(3)
          expect(files.filter(item => path.extname(item) === '.html').length).to.equal(3)
        } else {
          // Check for temporary files erasing
          expect(files.length).to.equal(0)
        }
      })
    })
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('stores elements in DB', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find()
        .then(response => {
          expect(response.data.length).to.equal(3)
          // Ensure correct data filtering
          expect(response.data[0].runTime).toExist()
          expect(response.data[0].forecastTime).toExist()
          expect(response.data[0].minValue).toExist()
          expect(response.data[0].maxValue).toExist()
          expect(response.data[0].data).to.beUndefined()
        })
      )
    })

    return Promise.all(findPromises)
  })

  it('queries elements in DB', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find({
          query: {
            time: new Date().toISOString(),
            $select: ['forecastTime', 'data', 'minValue', 'maxValue']
          }
        })
        .then(response => {
          expect(response.data.length).to.equal(1)
          expect(response.data[0].data.length).to.equal(4)
          expect(response.data[0].minValue).to.equal(0)
          expect(response.data[0].maxValue).to.equal(1)
        })
      )
    })

    return Promise.all(findPromises)
  })

  // Cleanup
  after(() => {
    app.getService('forecasts').Model.drop()
    services.forEach(service => {
      service.Model.drop()
      // GridFS collections
      if (service.element.dataStore === 'gridfs') {
        app.db.collection(service.forecast.name + '/' + service.element.name + '.chunks').drop()
        app.db.collection(service.forecast.name + '/' + service.element.name + '.files').drop()
      }
      fs.removeSync(service.getDataDirectory())
    })
  })
})
