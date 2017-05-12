import { hooks } from '../../../src'

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
module.exports = {
  before: {
    all: [ hooks.marshallQuery, hooks.processForecastTime ],
    find: [],
    get: [],
    create: [ hooks.marshall ],
    update: [],
    patch: [],
    remove: []
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
