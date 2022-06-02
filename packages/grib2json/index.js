import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { execFile } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const grib2jsonCommand = process.env.GRIB2JSON ||
  path.join(__dirname, 'bin', os.platform() === 'win32' ? 'grib2json.cmd' : 'grib2json')

const INTERNAL_OPTIONS = ['bufferSize', 'version', 'precision', 'verbose']

const grib2json = function (filePath, options) {
  const numberFormatter = function (key, value) {
    return value.toFixed ? Number(value.toFixed(options.precision)) : value
  }

  const promise = new Promise(function (resolve, reject) {
    let optionsNames = Object.keys(options)
    optionsNames = optionsNames.filter(arg => options[arg] &&
      // These ones are used internally
      !INTERNAL_OPTIONS.includes(arg))
    const args = []
    optionsNames.forEach(name => {
      if (typeof options[name] === 'boolean') {
        args.push('--' + name)
      } else {
        args.push('--' + name)
        args.push(options[name].toString())
      }
    })
    // Last to come the file name
    args.push(filePath)
    execFile(grib2jsonCommand, args, { maxBuffer: options.bufferSize || 8 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        reject(error)
        return
      }
      if (options.output) {
        fs.readJson(options.output, (error, json) => {
          if (error) {
            reject(error)
            return
          }
          if (options.verbose) {
            json.forEach(variable => console.log('Wrote ' + variable.data.length + ' points into file for variable ', variable.header))
          }
          if (options.precision >= 0) {
            fs.writeFile(options.output, JSON.stringify(json, numberFormatter), function (err) {
              if (err) {
                console.error('Writing output file failed : ', err)
                return
              }
              resolve(json)
            })
          } else {
            resolve(json)
          }
        })
      } else {
        const json = JSON.parse(stdout)
        if (options.verbose) {
          json.forEach(variable => console.log('Generated ' + variable.data.length + ' points in memory for variable ', variable.header))
        }
        // console.log(stdout)
        resolve(json)
      }
    })
  })

  return promise
}

export default grib2json
