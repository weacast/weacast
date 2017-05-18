import path from 'path'
import proto from 'uberproto'
import elementMixins from './mixins'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import rest from 'feathers-rest'
import socketio from 'feathers-socketio'
import authentication from 'feathers-authentication'
import jwt from 'feathers-authentication-jwt'
import local from 'feathers-authentication-local'
import { Database } from './db'

function auth () {
  const app = this
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local())
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.getService('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  })
}

function declareService (name, app, service) {
  const path = app.get('apiPath') + '/' + name
  // Initialize our service
  app.use(path, service)

  return app.getService(name)
}

function configureService (name, service, servicesPath) {
  const hooks = require(path.join(servicesPath, name, name + '.hooks'))
  service.hooks(hooks)

  if (service.filter) {
    const filters = require(path.join(servicesPath, name, name + '.filters'))
    service.filter(filters)
  }

  return service
}

export function createService (name, app, modelsPath, servicesPath, options) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(modelsPath, name + '.model.' + app.db.adapter))

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate
  }, options || {})
  configureModel(app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(name, app, service)
  // Register hooks and filters
  service = configureService(name, service, servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  try {
    const serviceMixin = require(path.join(servicesPath, name, name + '.service'))
    proto.mixin(serviceMixin, service)
  } catch (error) {
    // As this is optionnal this require has to fail silently
  }
  // Then configuration
  service.name = name
  service.app = app

  return service
}

export function createElementService (forecast, element, app, servicesPath, options) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(__dirname, 'models', 'elements.model.' + app.db.adapter))
  let serviceName = forecast.name + '/' + element.name

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: serviceName,
    paginate
  }, options || {})
  configureModel(forecast, element, app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(serviceName, app, service)
  // Register hooks and filters
  service = configureService(forecast.model, service, servicesPath)

  // Apply all element mixins
  elementMixins.forEach(mixin => { proto.mixin(mixin, service) })
  // Apply specific model service mixin
  const serviceMixin = require(path.join(servicesPath, forecast.model, forecast.model + '.service'))
  proto.mixin(serviceMixin, service)
  // Then configuration
  service.app = app
  service.name = serviceName
  service.forecast = forecast
  service.element = element

  return service
}

// Get all element services
function getElementServices (app, name) {
  let forecasts = app.get('forecasts')
  if (name) {
    forecasts = forecasts.filter(forecast => forecast.name === name)
  }

  // Iterate over configured forecast models
  let services = []
  for (let forecast of forecasts) {
    for (let element of forecast.elements) {
      let service = app.getService(forecast.name + '/' + element.name)
      if (service) {
        services.push(service)
      }
    }
  }
  return services
}

export default function weacast () {
  let app = feathers()

  // This avoid managing the API path before each service name
  app.getService = function (path) {
    return app.service(app.get('apiPath') + '/' + path)
  }
  // This is used to create standard services
  app.createService = function (name, modelsPath, servicesPath) {
    return createService(name, app, modelsPath, servicesPath)
  }
  // This is used to retrieve all element services registered by forecast model plugins
  app.getElementServices = function (name) {
    return getElementServices(app, name)
  }
  // This is used to create forecast element services
  app.createElementService = function (forecast, element, servicesPath) {
    return createElementService(forecast, element, app, servicesPath)
  }

  // Load app configuration
  app.configure(configuration())

  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Set up plugins and providers
  app.configure(hooks())
  app.configure(rest())
  app.configure(socketio({
    path: app.get('apiPath') + 'ws'
  }))

  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
