const { authenticate } = require('feathers-authentication').hooks
import { marshall, unmarshall, nearestForecastTime, marshallQuery } from '../../hooks'

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ marshallQuery, nearestForecastTime ],
    get: [],
    create: [ marshall ],
    update: [ marshall ],
    patch: [ marshallQuery, marshall ],
    remove: [ marshallQuery ]
  },

  after: {
    all: [ unmarshall ],
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
