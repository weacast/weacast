import fs from 'fs-extra'
import path from 'path'
import utility from 'util'
import request from 'superagent'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { fileURLToPath } from 'url'
import { Server } from '../src/server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('weacast-api', () => {
  let server, port
  const now = new Date()
  const logFilePath = path.join(__dirname, 'logs', 'weacast-' + now.toISOString().slice(0, 10) + '.log')

  before(() => {
    chailint(chai, util)
  })

  it('is CommonJS compatible', () => {
    expect(typeof Server).to.equal('function')
  })

  it('initialize the server', async () => {
    server = new Server()
    await server.run()
    port = server.app.get('port')
  })
  // Let enough time to process
    .timeout(20000)

  it('registers the users service', () => {
    const service = server.app.getService('users')
    expect(service).toExist()
  })

  it('infos appear in logs', (done) => {
    const logs = [
      'Installing forecast update on arpege-europe',
      'Installing forecast update on gfs-world'
    ]
    // FIXME: need to let some time to proceed with log file
    // Didn't find a better way since fs.watch() does not seem to work...
    setTimeout(() => {
      fs.readFile(logFilePath, 'utf8', (err, content) => {
        expect(err).beNull()
        logs.forEach(log => expect(content.includes(log)).to.equal(true))
        done()
      })
    }, 8000)
  })
  // Let enough time to process
    .timeout(10000)

  it('verify healthcheck endpoint', async () => {
    let response = await request.get(`http://localhost:${port}/api/healthcheck`)
    expect(response.body).to.deep.equal({ isRunning: true, areServicesRunning: true })
    await server.app.db.db().dropDatabase()
    // Wait long enough to be sure the database disconnection is effective in healthcheck
    await utility.promisify(setTimeout)(3000)
    try {
      response = await request.get(`http://localhost:${port}/api/healthcheck`)
    } catch (error) {
      expect(error.status).to.equal(500)
      expect(error.response.body.isRunning).beTrue()
      expect(error.response.body.areServicesRunning).beFalse()
      expect(error.response.body.error).toExist()
      expect(error.response.body.error.name).to.equal('GeneralError')
    }
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async function () {
    // Let enough time to process
    this.timeout(5000)
    // Already done in healthcheck test
    //await server.app.db.db().dropDatabase()
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    await server.app.db.disconnect()
  })
})
