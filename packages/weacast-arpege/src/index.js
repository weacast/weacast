import path from 'path'
import { initializePlugin } from 'weacast-core'

export default function init () {
  const app = this

  initializePlugin(app, 'arpege', path.join(__dirname, 'services'))
}
