const { authenticate } = require('feathers-authentication').hooks
import { marshall, unmarshall, nearestForecastTime } from '../../hooks'

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ nearestForecastTime ],
    get: [ unmarshall ],
    create: [ marshall ],
    update: [ marshall ],
    patch: [ marshall ],
    remove: []
  },

  after: {
    all: [],
    find: [ unmarshall ],
    get: [ unmarshall ],
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
