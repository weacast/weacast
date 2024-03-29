import * as feathersHooks from 'feathers-hooks-common'
import * as hooks from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: feathersHooks.disallow('external'),
    update: feathersHooks.disallow('external'),
    patch: feathersHooks.disallow('external'),
    remove: feathersHooks.disallow('external')
  },

  after: {
    all: [feathersHooks.iff(feathersHooks.isProvider('external'), feathersHooks.discard('token')), hooks.skipEvents],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
