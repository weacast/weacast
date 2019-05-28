import makeDebug from 'debug'
import _ from 'lodash'
import { Verifier } from '@feathersjs/authentication-oauth2'

const debug = makeDebug('feathers-authentication-oauth2:verify')

class OAuth2Verifier extends Verifier {
  constructor (app, options = {}) {
    options.emailField = options.emailField || 'email'
    options.emailFieldInProfile = options.emailFieldInProfile || ['email', 'emails[0].value']
    // Unify this property as array, indeed the email might be at different places depending on the provider
    if (!Array.isArray(options.emailFieldInProfile)) {
      options.emailFieldInProfile = [options.emailFieldInProfile]
    }
    super(app, options)
  }

  _createEntity (data) {
    if (!data.profile.id) {
      data.profile.id = data.profile.sub
      delete data.profile.sub
    }
    return super._createEntity(data)
  }

  _updateEntity (entity, data) {
    if (!data.profile.id) {
      data.profile.id = data.profile.sub
      delete data.profile.sub
    }
    return super._updateEntity(entity, data)
  }

  verify (req, accessToken, refreshToken, profile, done) {
    debug('Checking credentials')
    const options = this.options
    const query = {
      $or: [
        { [options.idField]: profile.id || profile.sub }
      ],
      $limit: 1
    }
    options.emailFieldInProfile.forEach(emailFieldInProfile => {
      query.$or.push({ [options.emailField]: _.get(profile, emailFieldInProfile) })
    })
    const data = { profile, accessToken, refreshToken }
    let existing

    // Check request object for an existing entity
    if (req && req[options.entity]) {
      existing = req[options.entity]
    }

    // Check the request that came from a hook for an existing entity
    if (!existing && req && req.params && req.params[options.entity]) {
      existing = req.params[options.entity]
    }

    // If there is already an entity on the request object (ie. they are
    // already authenticated) attach the profile to the existing entity
    // because they are likely "linking" social accounts/profiles.
    if (existing) {
      return this._updateEntity(existing, data)
        .then(entity => done(null, entity))
        .catch(error => error ? done(error) : done(null, error))
    }

    // Find or create the user since they could have signed up via facebook.
    this.service
      .find({ query })
      .then(this._normalizeResult)
      .then(entity => entity ? this._updateEntity(entity, data) : this._createEntity(data))
      .then(entity => {
        const id = entity[this.service.id]
        const payload = { [`${this.options.entity}Id`]: id }
        done(null, entity, payload)
      })
      .catch(error => error ? done(error) : done(null, error))
  }
}

export default OAuth2Verifier
