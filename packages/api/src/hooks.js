// Application hooks that run for every service
import { hooks } from '@weacast/core'
import * as commonHooks from 'feathers-hooks-common'
import { authenticate } from '@feathersjs/authentication'

export default {
  before: {
    all: [hooks.log,
      // We skip authentication in some cases
      commonHooks.when(hook => {
        const authConfig = hook.app.get('authentication')
        if (!authConfig) return false
        const distributedConfig = hook.app.get('distribution')
        if (hook.params.fromRemote && distributedConfig) {
          if (!distributedConfig.authentication) return false
        }
        // First built-in Feathers services like authentication
        if (!hook.service.name) return false
        // Then user creation
        if ((hook.service.name === 'users') && (hook.method === 'create')) return false
        // If not exception perform authentication
        return true
      }, authenticate('jwt'))],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [hooks.log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [hooks.log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
