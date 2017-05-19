import makeDebug from 'debug'
import services from './services'
// A shorter version of all of this should be the following
/*
export * as hooks from './hooks'
export * from './service'
export * from './db'
export * from './plugin'
*/
// However for now we face a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
import { marshall, unmarshall, processForecastTime, marshallQuery, processData } from './hooks'
import { elementMixin, refreshMixin } from './mixins'
import initializePlugin from './plugin'
import weacast from './application'
export let hooks = { marshall, unmarshall, processForecastTime, marshallQuery, processData }
export { weacast }
export { Database } from './db'
export { Grid } from './grid'
export { initializePlugin }
export { elementMixin, refreshMixin }

const debug = makeDebug('weacast:weacast-core')

export default function init () {
  const app = this

  debug('Initializing weacast')
  app.configure(services)
}
