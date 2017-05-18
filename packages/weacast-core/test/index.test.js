import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { weacast } from '../src'

describe('weacast-core', () => {
  let app

  before(() => {
    chailint(chai, util)

    app = weacast()
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
