import fs from 'fs-extra'
import path from 'path'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { fileURLToPath } from 'url'
import { Server } from '../src/server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('weacast-api', () => {
  let server
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

  // Cleanup
  after(async function () {
    // Let enough time to process
    this.timeout(5000)
    await server.app.db.db().dropDatabase()
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    await server.app.db.disconnect()
  })
})
