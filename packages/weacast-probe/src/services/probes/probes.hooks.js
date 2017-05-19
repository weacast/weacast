import authentication from 'feathers-authentication'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { performProbing, removeResults } from '../../hooks'
const authenticate = authentication.hooks.authenticate

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Perform probing on insert
    create: [ performProbing ],
    update: [],
    patch: [],
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
