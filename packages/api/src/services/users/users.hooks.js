import * as feathersHooks from 'feathers-hooks-common'
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
    create: [feathersHooks.when(hook => _.get(hook.app.get('authentication'), 'disallowRegistration'), feathersHooks.disallow('external')),
      github(), google(), oidc(), cognito(), hashPassword('password'), gravatar()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [feathersHooks.when(hook => hook.params.provider, feathersHooks.discard('password'))],
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
