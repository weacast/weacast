import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast, Database } from '../src'

describe('weacast-core', () => {
  let app

  before(() => {
    chailint(chai, util)

    app = weacast()
    app.db = Database.create(app)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the forecasts service', () => {
    app.configure(core)
    let service = app.getService('forecasts')
    expect(service).toExist()
  })
})
