import authentication from 'feathers-authentication'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { performProbing } from '../../hooks'
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
