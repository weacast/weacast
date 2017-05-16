import path from 'path'
import proto from 'uberproto'
import elementMixins from './mixins'

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

export function createService (name, app, modelsPath, servicesPath) {
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
  service.name = serviceName
  service.forecast = forecast
  service.element = element

  return service
}
