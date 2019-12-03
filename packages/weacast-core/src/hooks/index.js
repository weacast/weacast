import { SKIP } from '@feathersjs/feathers'

export * from './marshall'
export * from './query'
export * from './logger'

export function skipEvents (hook) {
  return SKIP
}
