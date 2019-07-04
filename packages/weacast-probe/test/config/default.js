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
    }
  },
  db: {
    adapter: 'mongodb',
    path: path.join(__dirname, '../db-data'),
    url: (containerized ? 'mongodb://mongodb:27017/weacast-test' : 'mongodb://127.0.0.1:27017/weacast-test')
  },
  forecastPath: path.join(__dirname, '../forecast-data'),
  forecasts: [
    {
      name: 'gfs-world',
      label: 'GFS - 0.5°',
      description: 'World-wide',
      attribution: 'Forecast data from <a href="http://www.emc.ncep.noaa.gov/index.php?branch=GFS">NCEP</a>',
      model: 'gfs',
      baseUrl: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p50.pl',
      bounds: [0, -90, 360, 90],
      origin: [0, 90],
      size: [720, 361],
      resolution: [0.5, 0.5],
      tileResolution: [20, 20],
      runInterval: 6 * 3600,          // Produced every 6h
      oldestRunInterval: 24 * 3600,   // Don't go back in time older than 1 day
      interval: 3 * 3600,             // Steps of 3h
      lowerLimit: 0,                  // From T0
      upperLimit: 3 * 3600,           // Up to T0+3
      updateInterval: -1,             // We will check for update manually for testing
      keepPastForecasts: true,        // We will keep past forecast times so that the number of forecasts is predictable for tests
      elements: [
        {
          name: 'u-wind',
          variable: 'var_UGRD',
          levels: ['lev_10_m_above_ground']
        },
        {
          name: 'v-wind',
          variable: 'var_VGRD',
          levels: ['lev_10_m_above_ground']
        }
      ]
    }
  ]
}
