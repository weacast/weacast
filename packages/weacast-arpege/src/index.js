import path from 'path'
import hooks from './services/arpege/arpege.hooks'
import service from './services/arpege/arpege.service'
import { initializePlugin } from 'weacast-core'

const init = async function () {
  const app = this

  await initializePlugin(app, 'arpege', path.join(__dirname, 'services'))
}

export default init

// Sub-exports
Object.assign(init, {
  hooks,
  service
})
