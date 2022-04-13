import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import makeDebug from 'debug'
import _ from 'lodash'
import logger from 'winston'
import 'winston-daily-rotate-file'
import elementMixins from './mixins/index.js'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import feathers from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import mongo from 'mongodb'
import { Database } from './db.js'
import auth from './authentication.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { rest } = express
const { GridFSBucket } = mongo
const debug = makeDebug('weacast:weacast-core:application')

function declareService (name, app, service) {
  const path = app.get('apiPath') + '/' + name
  // Initialize our service
  app.use(path, service)
  debug('Service declared on path ' + path)

  return app.getService(name)
}

async function configureService (name, service, servicesPath) {
  try {
    const hooksModule = await import(pathToFileURL(path.join(servicesPath, name, name + '.hooks.js')))
    const hooks = hooksModule.default
    service.hooks(hooks)
    debug(name + ' service hooks configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service hooks configured on path ' + servicesPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  try {
    const channelsModule = await import(pathToFileURL(path.join(servicesPath, name, name + '.channels.js')))
    const channels = channelsModule.default
    _.forOwn(channels, (publisher, event) => {
      if (event === 'all') service.publish(publisher)
      else service.publish(event, publisher)
    })
    debug(name + ' service channels configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service channels configured on path ' + servicesPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  return service
}

export async function createService (name, app, modelsPath, servicesPath, options) {
  const feathersServiceModule = await import('feathers-' + app.db.adapter)
  const createFeathersService = feathersServiceModule.default
  const modelModule = await import(pathToFileURL(path.join(modelsPath, name + '.model.' + app.db.adapter + '.js')))
  const configureModel = modelModule.default

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate,
    whitelist: ['$exists']
  }, options || {})
  if (serviceOptions.disabled) return undefined
  configureModel(app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(name, app, service)
  // Register hooks and filters
  service = await configureService(name, service, servicesPath)
  // Optionally a specific service mixin can be provided, apply it
  try {
    const serviceMixinModule = await import(pathToFileURL(path.join(servicesPath, name, name + '.service.js')))
    const serviceMixin = serviceMixinModule.default
    Object.assign(service, serviceMixin)
  } catch (error) {
    debug('No ' + name + ' service mixin configured on path ' + servicesPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }
  // Then configuration
  service.name = name
  service.app = app

  debug(service.name + ' service registration completed')
  return service
}

export async function createElementService (forecast, element, app, servicesPath, options) {
  const feathersServiceModule = await import('feathers-' + app.db.adapter)
  const createFeathersService = feathersServiceModule.default
  const modelModule = await import(pathToFileURL(path.join(__dirname, 'models', 'elements.model.' + app.db.adapter + '.js')))
  const configureModel = modelModule.default
  const serviceName = forecast.name + '/' + element.name
  // The service object can be directly provided
  const isService = servicesPath && (typeof servicesPath === 'object')
  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: serviceName,
    paginate
  }, options || {})
  if (serviceOptions.disabled) return undefined
  if (!isService) configureModel(forecast, element, app, serviceOptions)

  // Initialize our service with any options it requires
  let service = (isService ? servicesPath : createFeathersService(serviceOptions))
  // Get our initialized service so that we can register hooks and filters
  service = declareService(serviceName, app, service)
  // Register hooks and filters
  // If no service file path provided use default
  if (servicesPath && !isService) {
    service = await configureService(forecast.model, service, servicesPath)
  } else {
    service = await configureService('elements', service, path.join(__dirname, 'services'))
  }

  // Apply all element mixins
  elementMixins.forEach(mixin => { Object.assign(service, mixin) })
  // Optionnally a specific service mixin can be provided, apply it
  if (servicesPath && !isService) {
    const serviceMixinModule = await import(pathToFileURL(path.join(servicesPath, forecast.model, forecast.model + '.service.js')))
    const serviceMixin = serviceMixinModule.default
    Object.assign(service, serviceMixin)
  }
  // Then configuration
  service.app = app
  service.name = serviceName
  service.forecast = forecast
  service.element = element
  // Attach a GridFS storage element when required
  if (element.dataStore === 'gridfs') {
    if (app.get('db').adapter !== 'mongodb') {
      throw new errors.GeneralError('GridFS store is only available for MongoDB adapter')
    }
    service.gfs = new GridFSBucket(app.db.db(serviceOptions.dbName), {
      // GridFS is use to bypass the limit of 16MB documents in MongoDB
      // We are not specifically interested in splitting the file in small chunks
      chunkSizeBytes: 8 * 1024 * 1024,
      bucketName: `${forecast.name}-${element.name}`
    })
  }

  debug(service.name + ' element service registration completed')
  return service
}

// Get all element services
function getElementServices (app, name) {
  let forecasts = app.get('forecasts')
  if (name) {
    forecasts = forecasts.filter(forecast => forecast.name === name)
  }

  // Iterate over configured forecast models
  const services = []
  for (const forecast of forecasts) {
    for (const element of forecast.elements) {
      const service = app.getService(forecast.name + '/' + element.name)
      if (service) {
        services.push(service)
      }
    }
  }
  return services
}

function setupLogger (logsConfig) {
  logsConfig = _.omit(logsConfig, ['level'])
  // We have one entry per log type
  const logsTypes = logsConfig ? Object.getOwnPropertyNames(logsConfig) : []
  // Create corresponding winston transports with options
  const transports = []
  logsTypes.forEach(logType => {
    const options = logsConfig[logType]
    transports.push(new logger.transports[logType](options))
  })
  // Reconfigure default winston logger
  try {
    const colorizer = logger.format.colorize()
    logger.configure({
      level: _.get(logsConfig, 'level', (process.env.NODE_ENV === 'development' ? 'debug' : 'info')),
      format: logger.format.combine(
        logger.format.simple(),
        logger.format.printf(msg =>
          colorizer.colorize(msg.level, `${msg.level}: ${msg.message}`)
        )
      ),
      transports
    })
    logger.info('Logger configured')
  } catch (error) {
    // Logger might be down, use console
    console.error('Could not setup default logger', error)
  }
}

export default function weacast () {
  const app = express(feathers())
  // Load app configuration first
  app.configure(configuration())
  // Then setup logger
  setupLogger(app.get('logs'))

  // This retrieve corresponding service options from app config if any
  app.getServiceOptions = function (name) {
    const services = app.get('services')
    if (!services) return {}
    return _.get(services, name, {})
  }
  // This avoid managing the API path before each service name
  app.getService = function (path) {
    return app.service(app.get('apiPath') + '/' + path)
  }
  // This is used to create standard services
  app.createService = async function (name, modelsPath, servicesPath, options) {
    const service = await createService(name, app, modelsPath, servicesPath, options)
    return service
  }
  // This is used to retrieve all element services registered by forecast model plugins
  app.getElementServices = function (name) {
    return getElementServices(app, name)
  }
  // This is used to create forecast element services
  app.createElementService = async function (forecast, element, servicesPath, options) {
    const service = await createElementService(forecast, element, app, servicesPath, options)
    return service
  }
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  app.configure = async function (fn) {
    await fn.call(this, this)
    return this
  }

  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Set up plugins and providers
  app.configure(rest())
  app.configure(socketio({ path: app.get('apiPath') + 'ws' }))
  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
