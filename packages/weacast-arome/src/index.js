import path from 'path'
import hooks from './services/arome/arome.hooks'
import service from './services/arome/arome.service'
import { initializePlugin } from 'weacast-core'

export default function init () {
  const app = this

  initializePlugin(app, 'arome', path.join(__dirname, 'services'))
}

// Sub-exports
Object.assign(init, {
  hooks,
  service
})
