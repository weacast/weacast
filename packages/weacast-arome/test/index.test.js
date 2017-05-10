import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { Database } from 'weacast-core'
import arome from '../src'

describe('weacast-arome', () => {
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
    expect(typeof arome).to.equal('function')
  })

  it('registers the element services', () => {
    expect(typeof arome).to.equal('function')
    app.configure(core)
    app.configure(arome)
    expect(app.service('arome-france/u-wind')).to.not.beUndefined()
    expect(app.service('arome-france/v-wind')).to.not.beUndefined()
    expect(app.service('arome-france/temperature')).to.not.beUndefined()
  })
})
