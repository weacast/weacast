var path = require('path')
var containerized = require('containerized')()

var API_PREFIX = '/api'

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
    strategies: [
      'jwt',
      'local'
    ],
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users'
  },
  logs: {
    Console: {
      colorize: true,
      level: 'verbose'
    },
    DailyRotateFile: {
      filename: path.join(__dirname, '..', 'test-log-'),
      datePattern: 'yyyy-MM-dd.log',
      maxDays: 5
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
