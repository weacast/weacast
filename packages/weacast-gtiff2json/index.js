const ps = require('geo-pixel-stream')
      fs = require('fs')
      program = require('commander')

function readGeoTiff(filePath, verbose) {
  return new Promise(function(resolve, reject) {
    let readers = ps.createReadStreams(filePath)
    let blocks = []

    if (verbose) {
      console.log('File metadata :')
      console.log(readers[0].metadata)
    }

    readers[0].on('data', function(data) {
      var blockPoints = [],
          blockLen = data.blockSize.x * data.blockSize.y
      
      for (let i=0; i<blockLen; i++)
        blockPoints.push(data.buffer[i])
      blocks.push(blockPoints)
    })

    readers[0].on('end', function() {
      resolve({ blocks: blocks, metadata: readers[0].metadata })
    })
  })
}

function linearize(blocks, block_width, blocks_per_row, verbose) {
  let points = []
  if (verbose) {
    console.log('Found ' + blocks.length + ' blocks of ' + blocks[0].length + ' points')
  }
  
  for (let i=0; i<blocks.length * blocks[0].length; i++) {
    let col = i % (block_width * blocks_per_row), row = Math.floor(i / (block_width * blocks_per_row))
    let block = Math.floor(col / block_width) + Math.floor(row / block_width) * blocks_per_row

    let colInBlock = col % block_width
    let rowInBlock = row % block_width

    //console.log(row, col, block, colInBlock, rowInBlock)

    points[i] = blocks[block][colInBlock + rowInBlock * block_width]
  }

  if (verbose) {
    console.log('Linearized ' + points.length + ' points.')
  }
  return points 
}

function compressRLE(points, round, verbose) {
  let output = []
  let currentValue = points[0], currentLen = 1
  if (round) {
    currentValue = Math.round(currentValue)
  }

  for (let i=1, len = points.length; i<len; i++) {
    let value = points[i]
    if (round) {
      value = Math.round(value)
    }
    if (value == currentValue) currentLen++
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

var gtiff2json = function(filePath, compress, round, verbose) {
  return new Promise(function(resolve, reject) {
    readGeoTiff(filePath, verbose).then(function(data) {
      return linearize(data.blocks, data.metadata.blockSize.x, Math.max(1, data.metadata.width / data.metadata.blockSize.x), verbose)
    })
    .then(function(points) {
      if (!compress) {
        resolve(points)
      } else {
        resolve(compressRLE(points, round, verbose))
      }
    })
    .catch(function(err) {
      reject(err)
    })
  })
}

if (require.main === module) {
  program
    .version(require('./package.json').version)
    .usage('<file> [options]')
    .option('-c, --compress', 'Output RLE compressed JSON')
    .option('-r, --round', 'Round values to nearest integer when performing RLE compression')
    .option('-o, --output <file>', 'Output in a file instead of stdout')
    .option('-v, --verbose', 'Verbose mode for debug purpose')
    .parse(process.argv)

  var inputFile = program.args[0]

  gtiff2json(inputFile, program.compress, program.round, program.verbose).then(function(points) {
    if (program.output) {
      fs.writeFile(program.output, JSON.stringify(points), function(err) {
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
  .catch(function(err) {
    console.log(err)
  })
} else {
  module.exports = gtiff2json
}
