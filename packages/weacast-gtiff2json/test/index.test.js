let fs = require('fs')
let path = require('path')
let chai = require('chai')
let chailint = require('chai-lint')
let gtiff2json = require('..')

describe('weacast-gtiff2json', () => {
  before(() => {
    chailint(chai, chai.util)
  })

  it('is CommonJS compatible', () => {
    chai.expect(typeof gtiff2json).to.equal('function')
  })

  it('generates valid RLE json', () => {
    let jsonArray = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'rle.json')))
    gtiff2json(path.join(__dirname, 'data', 'rle.tif'), true, true).then(function (points) {
      chai.expect(points.length).to.equal(jsonArray.length)
      chai.expect(points).to.deep.equal(jsonArray)
    })
  })
})
