import authentication from 'feathers-authentication'
import { disallow } from 'feathers-hooks-common'
import { hooks } from 'weacast-core'
import { marshallResultQuery } from '../../hooks'
const authenticate = authentication.hooks.authenticate

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
module.exports = {
  before: {
    all: [ authenticate('jwt'), hooks.marshallQuery ],
    find: [ hooks.marshallComparisonQuery, hooks.marshallSpatialQuery, marshallResultQuery ],
    get: [],
    create: [ disallow('external'), hooks.marshall ],
    update: [ disallow('external'), hooks.marshall ],
    patch: [ disallow('external'), hooks.marshall ],
    remove: [ disallow('external'), hooks.marshallComparisonQuery, hooks.marshallSpatialQuery ]
  },

  after: {
    all: [ hooks.unmarshall ],
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
