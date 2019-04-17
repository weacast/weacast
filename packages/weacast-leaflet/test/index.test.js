import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import config from 'config'
import 'jsdom-global/register'
import fetch from 'isomorphic-fetch'
import { weacast } from 'weacast-core/client'

window.fetch = fetch

describe('weacast-leaflet', () => {
  let app

  before(() => {
    chailint(chai, util)
    app = weacast(config)
  })

  it('is CommonJS compatible', () => {
    expect(typeof weacast).to.equal('function')
    expect(app).toExist()
  })
})
