import path from 'path'
import { createService } from 'weacast-core'

export default function init () {
  const app = this

  createService('probes', app, path.join(__dirname, 'models'), path.join(__dirname, 'services'))
}
