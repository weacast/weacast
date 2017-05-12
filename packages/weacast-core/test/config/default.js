var path = require('path')
var containerized = require('containerized')()

module.exports = {
  port: process.env.PORT || 8081,

  apiPath: '/api',

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
    path: '/authentication',
    service: 'users'
  },
  db: {
    adapter: 'mongodb',
    path: path.join(__dirname, '../db-data'),
    url: (containerized ? 'mongodb://mongodb:27017/weacast' : 'mongodb://127.0.0.1:27017/weacast')
  },
  forecastPath: path.join(__dirname, '../forecast-data')
}
