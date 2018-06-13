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
      name: 'arome-france',
      label: 'AROME - 0.025°',
      description: 'France',
      attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
      model: 'arome',
      token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
      wcsBaseUrl: 'https://geoservices.meteofrance.fr/services/MF-NWP-HIGHRES-AROME-0025-FRANCE-WCS?SERVICE=WCS&version=2.0.1',
      bounds: [-8, 38, 12, 53],
      origin: [-8, 53],
      size: [801, 601],
      resolution: [0.025, 0.025],
      runInterval: 3 * 3600,            // Produced every 3h
      oldestRunInterval: 24 * 3600,     // Don't go back in time older than 1 day
      interval: 1 * 3600,               // Steps of 1h
      lowerLimit: 0,                    // From T0
      upperLimit: 3 * 3600,             // Up to T0+3
      updateInterval: -1,               // We will check for update manually for testing
      keepPastForecasts: true,          // We will keep past forecast times so that the number of forecasts is predictable for tests
      elements: [
        {
          name: 'temperature',
          coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
          subsets: {
            height: 2,
            long: [-8, 12],
            lat: [38, 53]
          },
          dataStore: 'fs'             // So that we can check for output files
        }
      ]
    }
  ]
}
