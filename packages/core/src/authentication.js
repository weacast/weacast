import _ from 'lodash'
import makeDebug from 'debug'
import errors from '@feathersjs/errors'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import OAuth from '@feathersjs/authentication-oauth'

const debug = makeDebug('weacast:weacast-core:authentication')
const { oauth, OAuthStrategy } = OAuth
const { NotAuthenticated } = errors

export class AuthenticationProviderStrategy extends OAuthStrategy {
  async getEntityData (profile, entity) {
    const createEntity = _.isNil(entity)
    // Add provider Id
    entity = { [`${this.name}Id`]: profile.id || profile.sub }
    // When creating a new user extract required information from profile
    if (createEntity) {
      _.set(entity, 'email', _.get(profile, this.emailFieldInProfile || 'email'))
      _.set(entity, 'name', _.get(profile, this.nameFieldInProfile || 'name'))
    }
    // Store provider profile information
    if (profile) entity[`${this.name}`] = profile

    debug('Creating/Updating OAuth user', entity)

    return entity
  }

  async getEntityQuery (profile) {
    const query = {
      $or: [
        { [`${this.name}Id`]: profile.id || profile.sub },
        { email: _.get(profile, this.emailFieldInProfile || 'email') }
      ],
      $limit: 1
    }

    debug('Finding OAuth user with query', query)

    return query
  }
}

// This strategy is inspired by the following:
// 1) Custom strategy to ensure we renew the JWT when reauthenticating
// https://deniapps.com/blog/jwt-token-auto-renew-auto-logout
// 2) Custom strategy to ensure we can use JWT tokens not attached to a user for API access
// https://docs.feathersjs.com/cookbook/authentication/stateless.html
// However, it has been rewritten to work simultaneously with:
// - a stateless or user attached JWT
// - a socket or a rest transport
// It also supports token given as query parameter
export class JWTAuthenticationStrategy extends JWTStrategy {
  async authenticate (authentication, params) {
    const { accessToken } = authentication
    const { entity } = this.configuration
    const renewJwt = _.get(this.configuration, 'renewJwt', true)

    if (!accessToken) {
      throw new NotAuthenticated('No access token')
    }

    const payload = await this.authentication.verifyAccessToken(accessToken, params.jwt)
    const result = {
      // First key trick - by deleting the token here
      // we will get Feathers generate a new one
      // accessToken,
      authentication: {
        strategy: 'jwt',
        accessToken,
        payload
      }
    }
    if (!renewJwt) result.accessToken = accessToken

    // Second key trick
    // Return user attached to the token if any
    // Return basic information for a stateless token otherwise
    if (payload.sub) {
      const entityId = await this.getEntityId(result, params)
      const value = await this.getEntity(entityId, params)

      return {
        ...result,
        [entity]: value
      }
    }

    return result
  }

  async parse (req) {
    const { jwt } = req.query
    if (jwt) {
      debug('Found parsed query value')
      delete req.query.jwt
      return {
        strategy: 'jwt',
        accessToken: jwt
      }
    } else {
      const result = await super.parse(req)
      return result
    }
  }
}

// Middleware to be used to support jwt as a query param
export function extractJwtFromQuery (req, res, next) {
  const { jwt } = req.query
  if (jwt) {
    _.set(req, 'feathers.authentication', {
      strategy: 'jwt',
      accessToken: jwt
    })
  }

  next()
}

export default function auth (app) {
  const config = app.get('authentication')
  if (!config) return
  // Having undefined providers causes an issue in feathers but we'd like to be able
  // to set providers undefined in config file based on some conditions (eg env vars)
  if (config.oauth) config.oauth = _.omitBy(config.oauth, _.isNil)
  app.set('authentication', config)

  const authentication = new AuthenticationService(app)

  const strategies = config.authStrategies || []
  if (strategies.includes('jwt')) authentication.register('jwt', new JWTStrategy())
  if (strategies.includes('local')) authentication.register('local', new LocalStrategy())
  if (config.oauth) {
    app.authenticationProviders = _.keys(_.omit(config.oauth, ['redirect', 'origins', 'defaults']))
    for (const provider of app.authenticationProviders) {
      authentication.register(provider, new AuthenticationProviderStrategy())
    }
  }
  app.use(`${app.get('apiPath')}/authentication`, authentication)
  app.configure(oauth())
}
