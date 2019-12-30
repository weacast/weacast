import commonHooks from 'feathers-hooks-common'
import _ from 'lodash'
import gravatar from '../../hooks/gravatar'
import { github, google, oidc, cognito } from '../../hooks/provider'
const { hashPassword } = require('@feathersjs/authentication-local').hooks

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ commonHooks.when(hook => _.get(hook.app.get('authentication'), 'disallowRegistration'), commonHooks.disallow('external')),
      github(), google(), oidc(), cognito(), hashPassword(), gravatar() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ commonHooks.when(hook => hook.params.provider, commonHooks.discard('password')) ],
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
