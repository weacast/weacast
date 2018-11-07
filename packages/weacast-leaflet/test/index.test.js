import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import config from 'config'
import 'jsdom-global/register'
import fetch from 'isomorphic-fetch'
// Importing the whole weacast module makes Leaflet time dimension fail due to jQuery not be defined
// The following workaround, although presented as working on the internet, does not help
// import jQuery from 'jquery'
// window.jQuery = window.$ = jQuery
// global.jQuery = global.$ = jQuery
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
  })
})
