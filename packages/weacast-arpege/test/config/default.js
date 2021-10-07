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
      name: 'arpege-world',
      label: 'ARPEGE - 0.25°',
      description: 'World-wide',
      attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
      model: 'arpege',
      token: process.env.METEO_FRANCE_TOKEN,
      wcsBaseUrl: 'https://public-api.meteofrance.fr/public/arpege/1.0/wcs/MF-NWP-GLOBAL-ARPEGE-025-GLOBE-WCS/GetCoverage?service=WCS&version=2.0.1',
      bounds: [0, -90, 360, 90],
      origin: [0, 90],
      size: [1440, 721],
      resolution: [0.25, 0.25],
      runInterval: 6 * 3600,          // Produced every 6h
      oldestRunInterval: 24 * 3600,   // Don't go back in time older than 1 day
      interval: 3 * 3600,             // Steps of 3h
      lowerLimit: 0,                  // From T0
      upperLimit: 6 * 3600,           // Up to T0+6
      updateInterval: -1,             // We will check for update manually for testing
      keepPastForecasts: true,        // We will keep past forecast times so that the number of forecasts is predictable for tests
      elements: [
        {
          name: 'temperature',
          coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
          subsets: {
            height: 2,
            long: [0, 360],
            lat: [-90, 90]
          },
          dataStore: 'fs'             // So that we can check for output files
        }
      ]
    }
  ]
}
