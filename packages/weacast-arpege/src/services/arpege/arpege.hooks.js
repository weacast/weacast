import { hooks } from 'weacast-core'
import authentication from 'feathers-authentication'
const authenticate = authentication.hooks.authenticate

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ hooks.marshallQuery, hooks.nearestForecastTime ],
    get: [],
    create: [ hooks.marshall ],
    update: [ hooks.marshall ],
    patch: [ hooks.marshallQuery, hooks.marshall ],
    remove: [ hooks.marshallQuery ]
  },

  after: {
    // By default do not response with data if not explicitely asked for
    all: [ hooks.discardData, hooks.unmarshall ],
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
