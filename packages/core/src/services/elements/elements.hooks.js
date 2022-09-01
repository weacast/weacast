import * as feathersHooks from 'feathers-hooks-common'
import * as hooks from '../../hooks/index.js'

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
export default {
  before: {
    all: [hooks.marshallQuery],
    find: [hooks.marshallSpatialQuery, hooks.marshallTileQuery, hooks.processForecastTime],
    get: [],
    create: [feathersHooks.disallow('external'), hooks.marshall],
    update: [feathersHooks.disallow('external'), hooks.marshall],
    patch: [feathersHooks.disallow('external'), hooks.marshall],
    remove: [feathersHooks.disallow('external')]
  },

  after: {
    // By default do not response with data if not explicitely asked for
    all: [hooks.unmarshall, hooks.processData],
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
