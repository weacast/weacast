import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chai from 'chai'
import chailint from 'chai-lint'
import gtiff2json from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('weacast-gtiff2json', () => {
  before(() => {
    chailint(chai, chai.util)
  })

  it('is ES module compatible', () => {
    chai.expect(typeof gtiff2json).to.equal('function')
  })

  it('generates valid RLE json', () => {
    let jsonArray = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'rle.json')))
    return gtiff2json(path.join(__dirname, 'data', 'rle.tif'), true, true).then(function (points) {
      chai.expect(points.length).to.equal(jsonArray.length)
      chai.expect(points).to.deep.equal(jsonArray)
    })
  })
  // Let enough time to process
    .timeout(10000)
})
