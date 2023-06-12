#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import program from 'commander'
import gtiff2json from './index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageInfo = fs.readJsonSync(path.join(__dirname, 'package.json'))

program
  .version(packageInfo.version)
  .usage('<file> [options]')
  .option('-c, --compress', 'Output RLE compressed JSON')
  .option('-r, --round', 'Round values to nearest integer when performing RLE compression')
  .option('-p, --precision <precision>', 'Limit precision in JSON using the given number of digits after the decimal point', -1)
  .option('-o, --output <file>', 'Output in a file instead of stdout')
  .option('-v, --verbose', 'Verbose mode for debug purpose')
  .parse(process.argv)

const inputFile = program.args[0]
program.precision = parseInt(program.precision)

const numberFormatter = function (key, value) {
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
