import fs from 'fs-extra'
import path from 'path'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { Server } from '../src/server'

describe('weacast-api', () => {
  let server
  let now = new Date()
  let logFilePath = path.join(__dirname, 'logs', 'weacast-api-' + now.toISOString().slice(0, 10) + '.log')
  
  before(() => {
    chailint(chai, util)
  })

  it('is CommonJS compatible', () => {
    expect(typeof Server).to.equal('function')
  })

  it('initialize the server', (done) => {
    server = new Server()
    server.run().then(() => done())
  })
  // Let enough time to process
  .timeout(10000)

  it('infos appear in logs', (done) => {
    let log = 'Checking for up-to-date forecast data on arpege-world/u-wind'
    // FIXME: need to let some time to proceed with log file
    // Didn't find a better way since fs.watch() does not seem to work...
    setTimeout(() => {
      fs.readFile(logFilePath, 'utf8', (err, content) => {
        expect(err).beNull()
        expect(content.includes(log)).to.equal(true)
        done()
      })
    }, 2500)
  })
  // Let enough time to process
  .timeout(5000)

  // Cleanup
  after(() => {
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    server.app.db._db.dropDatabase()
  })
})
