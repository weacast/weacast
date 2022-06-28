export * from './marshall.js'
export * from './query.js'
export * from './logger.js'

export function skipEvents (hook) {
  hook.event = null
  return hook
}
