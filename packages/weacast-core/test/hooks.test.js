import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { hooks } from '../src'

describe('weacast-core:hooks', () => {
  before(() => {
    chailint(chai, util)
  })

  it('marshalls time queries', () => {
    const now = new Date()
    let hook = { type: 'before', params: { query: { runTime: now.toISOString(), forecastTime: now.toISOString() } } }
    hooks.marshallQuery(hook)
    expect(typeof hook.params.query.runTime).to.equal('object')
    expect(hook.params.query.runTime.getTime()).to.equal(now.getTime())
    expect(typeof hook.params.query.forecastTime).to.equal('object')
    expect(hook.params.query.forecastTime.getTime()).to.equal(now.getTime())
  })

  it('marshalls comparison queries', () => {
    const now = new Date()
    let hook = { type: 'before', params: { query: { number: { $gt: '0', $lt: '10' }, date: { $gte: now.toISOString(), $lte: now.toISOString() } } } }
    hooks.marshallComparisonQuery(hook)
    expect(typeof hook.params.query.number.$gt).to.equal('number')
    expect(typeof hook.params.query.number.$lt).to.equal('number')
    expect(hook.params.query.number.$gt).to.equal(0)
    expect(hook.params.query.number.$lt).to.equal(10)
    expect(typeof hook.params.query.date.$gte).to.equal('object')
    expect(typeof hook.params.query.date.$lte).to.equal('object')
    expect(hook.params.query.date.$gte.getTime()).to.equal(now.getTime())
    expect(hook.params.query.date.$lte.getTime()).to.equal(now.getTime())
  })

  it('marshalls geometry queries', () => {
    let hook = { type: 'before', params: { query: { geometry: { $near: { $geometry: { type: 'Point', coordinates: ['56', '0.3'] }, $maxDistance: '1000.50' } } } } }
    hooks.marshallSpatialQuery(hook)
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal('number')
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal('number')
    expect(hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal(56)
    expect(hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal(0.3)
    expect(typeof hook.params.query.geometry.$near.$maxDistance).to.equal('number')
    expect(hook.params.query.geometry.$near.$maxDistance).to.equal(1000.5)
  })

  it('manage shortcuts for geometry queries', () => {
    let hook = { type: 'before', params: { query: { centerLon: '56', centerLat: '0.3', distance: '1000.50' } } }
    hooks.marshallSpatialQuery(hook)
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal('number')
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal('number')
    expect(hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal(56)
    expect(hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal(0.3)
    expect(typeof hook.params.query.geometry.$near.$maxDistance).to.equal('number')
    expect(hook.params.query.geometry.$near.$maxDistance).to.equal(1000.5)
    hook = { type: 'before', params: { query: { south: '44', north: '45', west: '0', east: '1' } } }
    hooks.marshallSpatialQuery(hook)
    expect(Array.isArray(hook.params.query.geometry.$geoIntersects.$geometry.coordinates[0])).beTrue()
    expect(hook.params.query.geometry.$geoIntersects.$geometry.coordinates[0]).to.deep.equal([[0, 44], [1, 44], [1, 45], [0, 45], [0, 44]])
    expect(typeof hook.params.query.geometry.$geoIntersects.$geometry.type).to.equal('string')
    expect(hook.params.query.geometry.$geoIntersects.$geometry.type).to.equal('Polygon')
  })

  // Cleanup
  after(async () => {
  })
})
