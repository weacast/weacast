import path from 'path'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import nock from 'nock'
import core, { weacast } from '../src'

describe('weacast-core:elements', () => {
  let app
  const interval = 3
  const nbSteps = 3
  let forecast = {
    name: 'test-forecast',
    model: 'test-model',
    bounds: [-180, -90, 180, 90],
    origin: [-180, 90],
    size: [4, 3],
    resolution: [90, 90],
    tileResolution: [90, 90],
    keepPastForecasts: true,        // We will keep past forecast times so that the number of forecasts is predictable for tests
    runInterval: 2 * interval * 3600,           // Produced every 6h
    oldestRunInterval: 2 * interval * 3600,     // Don't go back in time older than 6h
    interval: interval * 3600,                  // Steps of 3h
    lowerLimit: 0 * 3600,                                   // From T0
    upperLimit: (nbSteps - 1) * interval * 3600             // Up to T0+6h
  }
  let dataStores = ['db', 'fs', 'gridfs']
  let data = JSON.stringify([
    0, 1, 1, 0,
    1, 2, 2, 1,
    0, 1, 1, 0
  ])
  let services = []

  async function cleanup () {
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      await service.Model.deleteMany({})
      // GridFS collections
      if (service.element.dataStore === 'gridfs') {
        await app.db.collection(service.forecast.name + '/' + service.element.name + '.chunks').deleteMany({})
        await app.db.collection(service.forecast.name + '/' + service.element.name + '.files').deleteMany({})
      }
      fs.removeSync(service.getDataDirectory())
    }
  }

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

  it('performs the element download processes', async () => {
    // Clear any previous data
    await cleanup()
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      fs.emptyDirSync(service.getDataDirectory())
      for (let j = 0; j < nbSteps; j++) nock('https://www.elements.com').get('/').reply(200, data)
      let results = await service.updateForecastData()
      expect(results.length).to.equal(nbSteps)
      results.forEach(result => {
        // Ensure correct data filtering
        expect(result.runTime).toExist()
        expect(result.forecastTime).toExist()
        expect(result.minValue).toExist()
        expect(result.maxValue).toExist()
        expect(result.data).to.beUndefined()
      })
      let files = fs.readdirSync(service.getDataDirectory())
      // Check for file persistence
      if (service.element.dataStore === 'fs') {
        expect(files.length).to.equal(2 * nbSteps)
        expect(files.filter(item => path.extname(item) === '.json').length).to.equal(nbSteps)
        expect(files.filter(item => path.extname(item) === '.data').length).to.equal(nbSteps)
      } else {
        // FIXME : when fixed in weacast, for now temporary files are removed before each update
        // Check for temporary files erasing
        // expect(files.length).to.equal(0)
      }
    }
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('stores elements in DB', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find()
        .then(response => {
          expect(response.data.length).to.equal(nbSteps)
          // Ensure correct data filtering
          response.data.forEach(result => {
            expect(result.runTime).toExist()
            expect(result.forecastTime).toExist()
            expect(result.minValue).toExist()
            expect(result.maxValue).toExist()
            expect(result.data).to.beUndefined()
          })
        })
      )
    })

    return Promise.all(findPromises)
  })

  it('stores element tiles in DB', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find({ query: { geometry: { $exists: true } }, paginate: false })
        .then(response => {
          // We have one tile per each pixel
          expect(response.length).to.equal(8 * nbSteps)
          // Ensure correct data tiling
          response.forEach(tile => {
            expect(tile.runTime).toExist()
            expect(tile.forecastTime).toExist()
            expect(tile.minValue).toExist()
            expect(tile.maxValue).toExist()
            expect(tile.data).to.beUndefined()
          })
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
          expect(response.data[0].data.length).to.equal(4 * 3)
          expect(response.data[0].minValue).to.equal(0)
          expect(response.data[0].maxValue).to.equal(2)
        })
      )
    })

    return Promise.all(findPromises)
  })

  it('queries elements in DB with resampling', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find({
          query: {
            time: new Date().toISOString(),
            $select: ['forecastTime', 'data', 'minValue', 'maxValue'],
            oLon: -135,
            oLat: 45,
            sLon: 3,
            sLat: 2,
            dLon: 90,
            dLat: 90
          }
        })
        .then(response => {
          expect(response.data.length).to.equal(1)
          expect(response.data[0].data.length).to.equal(3 * 2)
          expect(response.data[0].minValue).to.equal(1)
          expect(response.data[0].maxValue).to.equal(1.5)
        })
      )
    })

    return Promise.all(findPromises)
  })

  it('queries element tiles in DB', () => {
    let findPromises = []
    services.forEach(service => {
      findPromises.push(
        service.find({
          query: {
            time: new Date().toISOString(),
            $select: ['forecastTime', 'data', 'minValue', 'maxValue'],
            geometry: {
              $geoIntersects: {
                $geometry: {
                  type: 'Point',
                  coordinates: [ -135, 45 ]
                }
              }
            }
          }
        })
        .then(response => {
          expect(response.data.length).to.equal(1)
          expect(response.data[0].data.length).to.equal(4)
          expect(response.data[0].minValue).to.equal(0)
          expect(response.data[0].maxValue).to.equal(2)
        })
      )
    })

    return Promise.all(findPromises)
  })

  it('performs the element download processes with failed requests (403)', async () => {
    // Clear any previous data
    await cleanup()
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      fs.emptyDirSync(service.getDataDirectory())
      for (let j = 0; j < (nbSteps - 1); j++) nock('https://www.elements.com').get('/').reply(200, data)
      // Add one failed request per update
      nock('https://www.elements.com').get('/').reply(403)
      let results = await service.updateForecastData()
      expect(results.length).to.equal(nbSteps - 1)
      let files = fs.readdirSync(service.getDataDirectory())
      // Check for file persistence
      if (service.element.dataStore === 'fs') {
        expect(files.length).to.equal(2 * (nbSteps - 1))
        expect(files.filter(item => path.extname(item) === '.json').length).to.equal(nbSteps - 1)
        expect(files.filter(item => path.extname(item) === '.data').length).to.equal(nbSteps - 1)
      } else {
        // FIXME : when fixed in weacast, for now temporary files are removed before each update
        // Check for temporary files erasing
        // expect(files.length).to.equal(0)
      }
    }
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('performs the element download processes with failed requests (timeout)', async () => {
    // Clear any previous data
    await cleanup()
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      fs.emptyDirSync(service.getDataDirectory())
      for (let j = 0; j < (nbSteps - 1); j++) nock('https://www.elements.com').get('/').reply(200, data)
      // Add one failed request per update
      nock('https://www.elements.com').get('/').delay(10000).reply(403)
      let results = await service.updateForecastData()
      expect(results.length).to.equal(nbSteps - 1)
      let files = fs.readdirSync(service.getDataDirectory())
      // Check for file persistence
      if (service.element.dataStore === 'fs') {
        expect(files.length).to.equal(2 * (nbSteps - 1))
        expect(files.filter(item => path.extname(item) === '.json').length).to.equal(nbSteps - 1)
        expect(files.filter(item => path.extname(item) === '.data').length).to.equal(nbSteps - 1)
      } else {
        // FIXME : when fixed in weacast, for now temporary files are removed before each update
        // Check for temporary files erasing
        // expect(files.length).to.equal(0)
      }
    }
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  it('performs the element download processes with failed conversions', async () => {
    // Clear any previous data
    await cleanup()
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      fs.emptyDirSync(service.getDataDirectory())
      for (let j = 0; j < nbSteps; j++) nock('https://www.elements.com').get('/').reply(200, data)
      // Add one failed conversion per update
      service.throwOnConvert = true
      let results = await service.updateForecastData()
      expect(results.length).to.equal(nbSteps - 1)
      let files = fs.readdirSync(service.getDataDirectory())
      // Check for file persistence
      if (service.element.dataStore === 'fs') {
        expect(files.length).to.equal(2 * nbSteps - 1)
        expect(files.filter(item => path.extname(item) === '.json').length).to.equal(nbSteps - 1)
        expect(files.filter(item => path.extname(item) === '.data').length).to.equal(nbSteps)
      } else {
        // FIXME : when fixed in weacast, for now temporary files are removed before each update
        // Check for temporary files erasing
        // expect(files.length).to.equal(0)
      }
    }
  })
  // Let enough time to download a couple of data
  .timeout(10000)

  // Cleanup
  after(async () => {
    await  app.getService('forecasts').Model.drop()
    await cleanup()
  })
})
