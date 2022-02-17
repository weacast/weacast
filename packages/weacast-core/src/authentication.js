import makeDebug from 'debug'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { expressOauth, OAuthStrategy } from '@feathersjs/authentication-oauth'

const debug = makeDebug('feathers-authentication-oauth2:verify')

export class OAuth2Verifier extends OAuthStrategy {
  async getEntityData(profile, entity) {
    return Object.assign({}, entity, profile)
  }

  async createEntity(profile) {
    if (!profile.id) {
      profile.id = profile.sub
      delete profile.sub
    }

    return { profile }
  }

  async updateEntity(entity, profile) {
    if (!profile.id) {
      profile.id = profile.sub
      delete profile.sub
    }

    return { profile }
  }

  async getEntityQuery(profile) {
    const options = this.authentication.configuration
    const query = {
      $or: [
        { [options.idField]: profile.id || profile.sub }
      ],
      $limit: 1
    }
    options.emailFieldInProfile.forEach(emailFieldInProfile => {
      query.$or.push({ [options.emailField]: _.get(profile, emailFieldInProfile) })
    })

    debug('Finding user', query)
    
    return query
  }
}

export default function auth (app) {
  const config = app.get('authentication')

  if (!config) return

  const emailFieldInProfile = config.emailFieldInProfile
    ? (Array.isArray(config.emailFieldInProfile) ? config.emailFieldInProfile : [ config.emailFieldInProfile ])
    : ['email', 'emails[0].value']
  const emailField = config.emailField || 'email'

  app.set('authentication', Object.assign({}, config, {
    emailField,
    emailFieldInProfile
  }))

  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('github', new OAuth2Verifier())
  authentication.register('google', new OAuth2Verifier())
  authentication.register('oidc', new OAuth2Verifier())
  authentication.register('cognito', new OAuth2Verifier())

  app.use(`${app.get('apiPath')}/authentication`, authentication)
  app.configure(expressOauth());
}
