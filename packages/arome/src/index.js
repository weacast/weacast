import path from 'path'
import hooks from './services/arome/arome.hooks'
import service from './services/arome/arome.service'
import { initializePlugin } from '@weacast/core'

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
