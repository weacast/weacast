import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { Database } from '../src'

describe('weacast-core', () => {
  let app

  before(() => {
    chailint(chai, util)

    app = feathers()
    app.configure(configuration())
    app.configure(hooks())
    app.db = Database.create(app)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the forecasts service', () => {
    expect(typeof core).to.equal('function')
    app.configure(core)
    let service = app.service('forecasts')
    expect(service).toExist()
  })
})
