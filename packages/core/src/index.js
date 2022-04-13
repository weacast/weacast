import makeDebug from 'debug'
import services from './services/index.js'
import initializeElements from './elements.js'
import initializePlugin from './plugin.js'
import weacast from './application.js'
import hooks from './services/elements/elements.hooks.js'

export const elements = { hooks }
export { weacast }
export { initializeElements, initializePlugin }
export { Database } from './db.js'
export * from './common/index.js'
export * as hooks from './hooks/index.js'
export * from './mixins/index.js'

const debug = makeDebug('weacast:weacast-core')

export default async function init (app) {
  debug('Initializing weacast')
  await app.configure(services)
}
