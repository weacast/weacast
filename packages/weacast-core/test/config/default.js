const path = require('path')
const containerized = require('containerized')()

const API_PREFIX = '/api'

module.exports = {
  port: process.env.PORT || 8081,

  apiPath: API_PREFIX,

  host: 'localhost',
  paginate: {
    default: 10,
    max: 50
  },
  authentication: {
    secret: 'b5KqXTye4fVxhGFpwMVZRO3R56wS5LNoJHifwgGOFkB5GfMWvIdrWyQxEJXswhAC',
    entity: 'user',
    service: API_PREFIX + '/users',
    authStrategies: ['jwt', 'local'],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: 'https://yourdomain.com',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    oauth: {
      redirect: '/'
    }
  },
  logs: {
    Console: {
      colorize: true,
      level: 'verbose'
    },
    DailyRotateFile: {
      filename: path.join(__dirname, '..', 'test-log-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: 5
    }
  },
  db: {
    adapter: 'mongodb',
    path: path.join(__dirname, '../db-data'),
    url: (containerized ? 'mongodb://mongodb:27017/weacast-test' : 'mongodb://127.0.0.1:27017/weacast-test'),
    secondaries: {
      elements: (containerized ? 'mongodb://mongodb:27017/weacast-test-elements' : 'mongodb://127.0.0.1:27017/weacast-test-elements')
    }
  },
  services: {
    forecasts: {},
    elements: { dbName: 'elements' }
  },
  forecastPath: path.join(__dirname, '../forecast-data')
}
