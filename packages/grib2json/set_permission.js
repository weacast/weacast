import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const grib2jsonCommand = process.env.GRIB2JSON ||
  path.join(__dirname, 'bin', os.platform() === 'win32' ? 'grib2json.cmd' : 'grib2json')

// Set command executable
fs.chmodSync(grib2jsonCommand, '754')
