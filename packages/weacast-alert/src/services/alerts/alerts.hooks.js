import { disallow } from 'feathers-hooks-common'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: disallow(),
    patch: disallow(),
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ hook => hook.service.registerAlert(hook.result) ],
    update: [],
    patch: [],
    remove: [ hook => hook.service.unregisterAlert(hook.result) ]
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
