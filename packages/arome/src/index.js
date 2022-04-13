import path from 'path'
import { fileURLToPath } from 'url'
import hooks from './services/arome/arome.hooks.js'
import service from './services/arome/arome.service.js'
import { initializePlugin } from '@weacast/core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const init = async function () {
  const app = this

  await initializePlugin(app, 'arome', path.join(__dirname, 'services'))
}

export default init

// Sub-exports
Object.assign(init, {
  hooks,
  service
})
