#!/usr/bin/env node

const ps = require('@kalisio/geo-pixel-stream')
const fs = require('fs')
const program = require('commander')

function readGeoTiff (filePath, verbose) {
  let promise = new Promise(function (resolve, reject) {
    let readers = ps.createReadStreams(filePath)
    let blocks = []

    if (verbose) {
      console.log('File metadata :')
      console.log(readers[0].metadata)
    }

    readers[0].on('data', function (data) {
      let blockPoints = []
      let blockLen = data.blockSize.x * data.blockSize.y

      for (let i = 0; i < blockLen; i++) { blockPoints.push(data.buffer[i]) }
      blocks.push(blockPoints)
    })

    readers[0].on('end', function () {
      // Force closing underlying GDAL dataset immediately (not waiting for GC) as it might be large
      readers[0]._src.close()
      resolve({ blocks: blocks, metadata: readers[0].metadata })
    })
  })

  return promise
}

function linearize (blocks, blockWidth, blocksPerRow, blockHeight, blocksPerCol, verbose) {
  let points = []
  if (verbose) {
    console.log('Found ' + blocks.length + ' blocks of ' + blocks[0].length + ' points')
    console.log('Linearize ' + blocksPerRow + ' blocks per row of width ' + blockWidth)
  }

  for (let row = 0; row < blockHeight * blocksPerCol; row++) {
    for (let col = 0; col < blockWidth * blocksPerRow; col++) {
      // let col = i % (blockWidth * blocksPerRow), row = Math.floor(i / (blockHeight * blocksPerCol))
      let block = Math.floor(col / blockWidth) + Math.floor(row / blockHeight) * blocksPerRow

      let colInBlock = col % blockWidth
      let rowInBlock = row % blockHeight

      // console.log(row, col, block, colInBlock, rowInBlock)

      points[col + row * blockWidth * blocksPerRow] = blocks[block][colInBlock + rowInBlock * blockWidth]
    }
  }

  if (verbose) {
    console.log('Linearized ' + points.length + ' points.')
  }
  return points
}

function compressRLE (points, round, verbose) {
  let output = []
  let currentValue = points[0]
  let currentLen = 1
  if (round) {
    currentValue = Math.round(currentValue)
  }

  for (let i = 1, len = points.length; i < len; i++) {
    let value = points[i]
    if (round) {
      value = Math.round(value)
    }
    if (value === currentValue) currentLen++
    else {
      output.push(currentValue)
      output.push(currentLen)

      currentValue = value
      currentLen = 1
    }
  }

  if (verbose) {
    console.log('Compressed to ' + output.length + ' points.')
  }
  return output
}

var gtiff2json = function (filePath, compress, round, verbose) {
  let promise = new Promise(function (resolve, reject) {
    readGeoTiff(filePath, verbose).then(function (data) {
      return linearize(data.blocks, data.metadata.blockSize.x, Math.max(1, data.metadata.width / data.metadata.blockSize.x),
                       data.metadata.blockSize.y, Math.max(1, data.metadata.height / data.metadata.blockSize.y), verbose)
    })
    .then(function (points) {
      if (!compress) {
        resolve(points)
      } else {
        resolve(compressRLE(points, round, verbose))
      }
    })
    .catch(function (err) {
      reject(err)
    })
  })

  return promise
}

if (require.main === module) {
  program
    .version(require('./package.json').version)
    .usage('<file> [options]')
    .option('-c, --compress', 'Output RLE compressed JSON')
    .option('-r, --round', 'Round values to nearest integer when performing RLE compression')
    .option('-p, --precision <precision>', 'Limit precision in JSON using the given number of digits after the decimal point', -1)
    .option('-o, --output <file>', 'Output in a file instead of stdout')
    .option('-v, --verbose', 'Verbose mode for debug purpose')
    .parse(process.argv)

  var inputFile = program.args[0]
  program.precision = parseInt(program.precision)

  var numberFormatter = function (key, value) {
    return ((program.precision >= 0) && value.toFixed) ? Number(value.toFixed(program.precision)) : value
  }

  gtiff2json(inputFile, program.compress, program.round, program.verbose).then(function (points) {
    if (program.output) {
      fs.writeFile(program.output, JSON.stringify(points, numberFormatter), function (err) {
        if (err) {
          console.error('Writing output file failed : ', err)
          return
        }
        if (program.verbose) {
          console.log('Wrote ' + points.length + ' points into file.')
        }
      })
    } else {
      console.log(points)
    }
  })
  .catch(function (err) {
    console.log(err)
  })
} else {
  module.exports = gtiff2json
}
