import authentication from 'feathers-authentication'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { hooks } from 'weacast-core'
import { marshallResultQuery } from '../../hooks'
const authenticate = authentication.hooks.authenticate

// Marshall/Unmarshall should be always first so that we have a consistent data format in other hooks
module.exports = {
  before: {
    all: [ authenticate('jwt'), hooks.marshallQuery ],
    find: [ marshallResultQuery ],
    get: [],
    create: [ hooks.marshall ],
    update: [ hooks.marshall ],
    patch: [ hooks.marshall ],
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
}
