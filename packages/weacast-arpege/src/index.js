import path from 'path'
import hooks from './services/arpege/arpege.hooks'
import service from './services/arpege/arpege.service'
import { initializePlugin } from 'weacast-core'

export default function init () {
  const app = this

  initializePlugin(app, 'arpege', path.join(__dirname, 'services'))
}

// Sub-exports
Object.assign(init, {
  hooks,
  service
})
