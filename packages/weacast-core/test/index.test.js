import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import { expect } from 'chai'
import { Database } from '../src'
import plugin from '../src'

describe('weacast-core', () => {
  let app

  before(() => {
    app = feathers()
    app.configure(configuration())
    app.configure(hooks())
    app.db = Database.create(app)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof plugin).to.equal('function')
  })

  it('registers the forecast service', () => {
    expect(typeof plugin).to.equal('function', 'It worked')
    app.configure(plugin)
    expect(app.service('forecasts')).to.not.equal.undefined
  })
})
