import commonHooks from 'feathers-hooks-common'
import _ from 'lodash'
import { hooks } from '@feathersjs/authentication-local'
import gravatar from '../../hooks/gravatar.js'
import { github, google, oidc, cognito } from '../../hooks/provider.js'

const { hashPassword } = hooks

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [commonHooks.when(hook => _.get(hook.app.get('authentication'), 'disallowRegistration'), commonHooks.disallow('external')),
      github(), google(), oidc(), cognito(), hashPassword(), gravatar()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [commonHooks.when(hook => hook.params.provider, commonHooks.discard('password'))],
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
