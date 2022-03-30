import { disallow } from 'feathers-hooks-common'
import { hooks } from '@weacast/core'
import { checkProbingType, performProbing, removeResults, removeFeatures } from '../../hooks'

module.exports = {
  before: {
    all: [ hooks.marshallQuery ],
    find: [],
    get: [],
    create: [ checkProbingType ],
    update: disallow(),
    patch: disallow(),
    remove: []
  },

  after: {
    // By default do not response with layer geometry if not explicitely asked for
    // Do not set the removeFeatures hook in all because probing needs to be done first on creation
    all: [],
    find: [ removeFeatures ],
    get: [ removeFeatures ],
    // Perform probing on insert
    create: [ performProbing, removeFeatures ],
    update: [ removeFeatures ],
    patch: [ removeFeatures ],
    // Perform results removing on delete
    remove: [ removeResults ]
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
