import path from 'path'
import hooks from './services/gfs/gfs.hooks'
import service from './services/gfs/gfs.service'
import { initializePlugin } from '@weacast/core'

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
