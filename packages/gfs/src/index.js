import path from 'path'
import { fileURLToPath } from 'url'
import hooks from './services/gfs/gfs.hooks.js'
import service from './services/gfs/gfs.service.js'
import { initializePlugin } from '@weacast/core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const init = async function () {
  const app = this

  await initializePlugin(app, 'gfs', path.join(__dirname, 'services'))
}

export default init

// Sub-exports
Object.assign(init, {
  hooks,
  service
})
