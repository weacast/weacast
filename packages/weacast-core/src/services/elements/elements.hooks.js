import { disallow } from 'feathers-hooks-common'
import hooks from '../../hooks'
import authentication from 'feathers-authentication'
const authenticate = authentication.hooks.authenticate

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
export default {
  before: {
    all: [ authenticate('jwt'), hooks.marshallQuery ],
    find: [ hooks.marshallSpatialQuery, hooks.processForecastTime ],
    get: [],
    create: [ disallow('external'), hooks.marshall ],
    update: [ disallow('external'), hooks.marshall ],
    patch: [ disallow('external'), hooks.marshall ],
    remove: [ disallow('external') ]
  },

  after: {
    // By default do not response with data if not explicitely asked for
    all: [ hooks.unmarshall, hooks.processData ],
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
