import path from 'path'
import proto from 'uberproto'
import elementMixins from './mixins'

function declareService(name, app, service) {
  // Initialize our service
  app.use('/' + name, service)
  
  return app.service(name)
}

function configureService(name, service, servicesPath) {
  const hooks = require(path.join(servicesPath, name, name + '.hooks'))
  service.hooks(hooks)

  if (service.filter) {
    const filters = require(path.join(servicesPath, name, name + '.filters'))
    service.filter(filters)
  }

  return service
}

export function createService (name, app, modelsPath, servicesPath,) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(modelsPath, name + '.model.' + app.db.adapter))
  
  const paginate = app.get('paginate')
  const serviceOptions = {
    name: name,
    paginate
  }
  configureModel(app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(name, app, service)
  // Register hooks and filters
  return configureService(name, service, servicesPath)
}

export function createElementService (forecast, element, app, servicesPath) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(__dirname, 'models', 'elements.model.' + app.db.adapter))
  let serviceName = forecast.name + '/' + element.name
  
  const paginate = app.get('paginate')
  const serviceOptions = {
    name: serviceName,
    paginate
  }
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
  service.forecast = forecast
  service.element = element

  return service
}

