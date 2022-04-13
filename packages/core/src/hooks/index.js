import feathers from '@feathersjs/feathers'

const { SKIP } = feathers

export * from './marshall.js'
export * from './query.js'
export * from './logger.js'

export function skipEvents (hook) {
  return SKIP
}
