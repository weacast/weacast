const path = require('path')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const socketio = require('feathers-socketio')
const authentication = require('feathers-authentication')
const jwt = require('feathers-authentication-jwt')
const local = require('feathers-authentication-local')

function auth() {
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

// Get all element services
function getElementServices (app, name) {
  let forecasts = app.get('forecasts');
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
  // This is used to retrieve all registered element plugins
  app.getElementServices = function (name) {
    return getElementServices(app, name)
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

  return app
}
