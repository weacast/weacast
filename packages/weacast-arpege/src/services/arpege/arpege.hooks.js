import { hooks } from 'weacast-core'
import authentication from 'feathers-authentication'
const authenticate = authentication.hooks.authenticate

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ hooks.marshallQuery, hooks.marshallSpatialQuery, hooks.processForecastTime ],
    get: [],
    create: [ hooks.marshall ],
    update: [ hooks.marshall ],
    patch: [ hooks.marshallQuery, hooks.marshall ],
    remove: [ hooks.marshallQuery ]
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
