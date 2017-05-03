import logger from 'winston'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-core')
// A shorter version of all of this should be the following
/*
export * as hooks from './hooks'
export * from './service'
export * from './db'
export * from './plugin'
*/
// However for now we face a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
import { marshall, unmarshall, nearestForecastTime, marshallQuery, discardData } from './hooks'
export let hooks = { marshall, unmarshall, nearestForecastTime, marshallQuery, discardData }
export { createService, createElementService } from './service'
export { Database } from './db'
export initializePlugin from './plugin'
import services from './services'

export default function init () {
  const app = this

  debug('Initializing weacast')
  app.configure(services)
}
