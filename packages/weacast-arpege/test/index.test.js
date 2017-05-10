import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { Database } from 'weacast-core'
import arpege from '../src'

describe('weacast-arpege', () => {
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
    expect(typeof arpege).to.equal('function')
  })

  it('registers the element services', () => {
    expect(typeof arpege).to.equal('function')
    app.configure(core)
    app.configure(arpege)
    expect(app.service('arpege-world/u-wind')).toExist()
    expect(app.service('arpege-world/v-wind')).toExist()
    expect(app.service('arpege-world/temperature')).toExist()
  })
})
