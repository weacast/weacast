var path = require('path')

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
    url: 'mongodb://127.0.0.1:27017/weacast'
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
      upperLimit: 42 * 3600,            // Up to T0+42
      updateInterval: 15 * 60,          // Check for update every 15 minutes
      elements: [
        {
          name: 'u-wind',
          coverageid: 'U_COMPONENT_OF_WIND__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
          subsets: {
            height: 10
          }
        },
        {
          name: 'v-wind',
          coverageid: 'V_COMPONENT_OF_WIND__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
          subsets: {
            height: 10
          }
        },
        {
          name: 'temperature',
          coverageid: 'TEMPERATURE__SPECIFIC_HEIGHT_LEVEL_ABOVE_GROUND',
          subsets: {
            height: 2
          }
        }
      ]
    }
  ]
}
