import path from 'path'
import filters from './services/gfs/gfs.filters'
import hooks from './services/gfs/gfs.hooks'
import service from './services/gfs/gfs.service'
import { initializePlugin } from 'weacast-core'

export default function init () {
  const app = this

  initializePlugin(app, 'gfs', path.join(__dirname, 'services'))
}

// Sub-exports
Object.assign(init, {
  filters,
  hooks,
  service
})
