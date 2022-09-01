import * as feathersHooks from 'feathers-hooks-common'
import _ from 'lodash'
import { hooks } from '@weacast/core'
import { marshallResultsQuery, aggregateResultsQuery } from '../../hooks/index.js'

// Used internally by bulk write to ensure hooks are still run as usual service call
const skipDbCallOnBulk = feathersHooks.when(hook => _.get(hook, 'params.bulk'), (hook) => { hook.result = hook.data })

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
export default {
  before: {
    all: [hooks.marshallQuery],
    find: [hooks.marshallComparisonQuery, hooks.marshallSpatialQuery, marshallResultsQuery, aggregateResultsQuery],
    get: [],
    create: [skipDbCallOnBulk, feathersHooks.disallow('external'), hooks.marshall],
    update: [skipDbCallOnBulk, feathersHooks.disallow('external'), hooks.marshall],
    patch: [skipDbCallOnBulk, feathersHooks.disallow('external'), hooks.marshall],
    remove: [feathersHooks.disallow('external'), hooks.marshallComparisonQuery, hooks.marshallSpatialQuery]
  },

  after: {
    all: [hooks.unmarshall],
    find: [],
    get: [],
    create: [hooks.skipEvents], // Avoid emitting events on result edition
    update: [hooks.skipEvents],
    patch: [hooks.skipEvents],
    remove: [hooks.skipEvents]
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
