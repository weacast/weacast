import moment from 'moment'
import { disallow, when } from 'feathers-hooks-common'
import * as hooks from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // Add default expiration date if none provided
      when(hook => !hook.data.expireAt, hook => {
        hook.data.expireAt = moment.utc().add({ days: 1 })
        return hook
      }),
      hooks.marshallAlert
    ],
    update: disallow(),
    patch: [
      disallow('external'),
      hooks.marshallAlert
    ],
    remove: []
  },

  after: {
    all: [ hooks.unmarshallAlert ],
    find: [],
    get: [],
    create: [ hook => {
      hook.service.registerAlert(hook.result)
      return hook
    } ],
    update: [],
    patch: [],
    remove: [ hook => {
      hook.service.unregisterAlert(hook.result)
      return hook
    } ]
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
