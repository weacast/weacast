import path from 'path'
import { createService } from '../service'

module.exports = function () {
  const app = this

  createService('forecasts', app, path.join(__dirname, '..', 'models'), path.join(__dirname, '..', 'services'))
}
