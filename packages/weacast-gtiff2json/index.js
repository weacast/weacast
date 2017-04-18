const ps = require('geo-pixel-stream')
      fs = require('fs')
      program = require('commander')

function readGeoTiff(filePath) {
  return new Promise(function(resolve, reject) {
    let readers = ps.createReadStreams(filePath)
    let blocks = []

    console.log('File metadata :')
    console.log(readers[0].metadata)

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

function linearize(blocks, block_width, blocks_per_row) {
  let points = []
  console.log('Found ' + blocks.length + ' blocks of ' + blocks[0].length + ' points')
  console.log('linearize...')
  
  for (let i=0; i<blocks.length * blocks[0].length; i++) {
    let col = i % (block_width * blocks_per_row), row = Math.floor(i / (block_width * blocks_per_row))
    let block = Math.floor(col / block_width) + Math.floor(row / block_width) * blocks_per_row

    let colInBlock = col % block_width
    let rowInBlock = row % block_width

    //console.log(row, col, block, colInBlock, rowInBlock)

    points[i] = blocks[block][colInBlock + rowInBlock * block_width]
  }

  console.log(points.length + ' points found.')
  return points 
}

var gtiff2json = function(filePath) {
  return new Promise(function(resolve, reject) {
    readGeoTiff(filePath).then(function(data) {
      return linearize(data.blocks, data.metadata.blockSize.x, data.blocks.length / data.metadata.blockSize.x)
    })
    .then(function(points) {
      resolve(points)
    })
    .catch(function(err) {
      reject(err)
    })
  })
}

module.exports = gtiff2json

program
  .version(require('./package.json').version)
  .usage('<file> [options]')
  .option('-o, --output <file>', 'Output in a file instead of stdout')
  .parse(process.argv)

var inputFile = program.args[0]

gtiff2json(inputFile).then(function(points) {
  if (program.output) {
    fs.writeFile(program.output, JSON.stringify(points), function(err) {
      if (err) {
        console.error('Writing output file failed : ', err)
        return
      }
      console.log('Wrote ' + points.length + ' points into file.')
    })
  } else {
    console.log(points)
  }
})
.catch(function(err) {
  console.log(err)
})
