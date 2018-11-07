import makeDebug from 'debug'
import services from './services'
import initializeElements from './elements'
import initializePlugin from './plugin'
import weacast from './application'
import filters from './services/elements/elements.filters'
import hooks from './services/elements/elements.hooks'

export let elements = { filters, hooks }
export { weacast }
export { initializeElements, initializePlugin }
export { Database } from './db'
export * from './common'
export * as hooks from './hooks'
export * from './mixins'

const debug = makeDebug('weacast:weacast-core')

export default function init () {
  const app = this

  debug('Initializing weacast')
  app.configure(services)
}
