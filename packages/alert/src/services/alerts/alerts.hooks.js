import moment from 'moment'
import * as feathersHooks from 'feathers-hooks-common'
import * as hooks from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // Add default expiration date if none provided
      feathersHooks.when(hook => !hook.data.expireAt, hook => {
        hook.data.expireAt = moment.utc().add({ days: 1 })
        return hook
      }),
      hooks.marshallAlert
    ],
    update: feathersHooks.disallow(),
    patch: [
      feathersHooks.disallow('external'),
      hooks.marshallAlert
    ],
    remove: []
  },

  after: {
    all: [],
    find: [hooks.unmarshallAlert],
    get: [hooks.unmarshallAlert],
    create: [hooks.unmarshallAlert, async hook => hook.service.registerAlert(hook.result)],
    update: [],
    patch: [hooks.unmarshallAlert],
    remove: [hooks.unmarshallAlert, async hook => hook.service.unregisterAlert(hook.result)]
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
