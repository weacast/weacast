import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-core')
import { marshall, unmarshall, nearestForecastTime, marshallQuery } from './hooks'
export let hooks = { marshall, unmarshall, nearestForecastTime, marshallQuery }
export { createService, createElementService } from './service'
export { Database } from './db'
export initializePlugin from './plugin'
import services from './services'

export default function init () {
  const app = this

  debug('Initializing weacast')
  app.configure(services)
}
