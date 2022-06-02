import ps from '@kalisio/geo-pixel-stream'

function readGeoTiff (filePath, verbose) {
  const promise = new Promise(function (resolve, reject) {
    const readers = ps.createReadStreams(filePath)
    const blocks = []

    if (verbose) {
      console.log('File metadata :')
      console.log(readers[0].metadata)
    }

    readers[0].on('data', function (data) {
      const blockPoints = []
      const blockLen = data.blockSize.x * data.blockSize.y

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
  const points = []
  if (verbose) {
    console.log('Found ' + blocks.length + ' blocks of ' + blocks[0].length + ' points')
    console.log('Linearize ' + blocksPerRow + ' blocks per row of width ' + blockWidth)
  }

  for (let row = 0; row < blockHeight * blocksPerCol; row++) {
    for (let col = 0; col < blockWidth * blocksPerRow; col++) {
      // let col = i % (blockWidth * blocksPerRow), row = Math.floor(i / (blockHeight * blocksPerCol))
      const block = Math.floor(col / blockWidth) + Math.floor(row / blockHeight) * blocksPerRow

      const colInBlock = col % blockWidth
      const rowInBlock = row % blockHeight

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
  const output = []
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

const gtiff2json = function (filePath, compress, round, verbose) {
  const promise = new Promise(function (resolve, reject) {
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

export default gtiff2json
