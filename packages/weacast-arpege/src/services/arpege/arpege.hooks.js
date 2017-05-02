import { hooks } from 'weacast-core'
const { authenticate } = require('feathers-authentication').hooks

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
};
