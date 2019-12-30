import fs from 'fs-extra'
import path from 'path'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { Server } from '../src/server'

describe('weacast-api', () => {
  let server
  let now = new Date()
  let logFilePath = path.join(__dirname, 'logs', 'weacast-' + now.toISOString().slice(0, 10) + '.log')

  before(() => {
    chailint(chai, util)
  })

  it('is CommonJS compatible', () => {
    expect(typeof Server).to.equal('function')
  })

  it('initialize the server', async () => {
    server = new Server()
    await server.run()
  })
  // Let enough time to process
  .timeout(20000)

  it('registers the users service', () => {
    let service = server.app.getService('users')
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
    }, 2500)
  })
  // Let enough time to process
  .timeout(5000)

  // Cleanup
  after(async () => {
    await server.app.db.db().dropDatabase()
    fs.emptyDirSync(path.join(__dirname, 'logs'))
  })
})
