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
      name: 'arpege-world',
      label: 'ARPEGE - 0.5°',
      description: 'World-wide',
      attribution: 'Forecast data from <a href="http://www.meteofrance.com">Météo-France</a>',
      model: 'arpege',
      token: '__qEMDoIC2ogPRlSoRQLGUBOomaxJyxdEd__',
      wcsBaseUrl: 'https://geoservices.meteofrance.fr/services/MF-NWP-GLOBAL-ARPEGE-05-GLOBE-WCS?SERVICE=WCS&version=2.0.1',
      bounds: [-180, -90, 180, 90],
      origin: [-180, 90],
      size: [720, 361],
      resolution: [0.5, 0.5],
      runInterval: 6 * 3600,          // Produced every 6h
      oldestRunInterval: 24 * 3600,   // Don't go back in time older than 1 day
      interval: 3 * 3600,             // Steps of 3h
      lowerLimit: 0,                  // From T0
      upperLimit: 102 * 3600,           // Up to T0+102
      updateInterval: 15 * 60,        // Check for update every 15 minutes
      elements: [
        {
          name: 'u-wind',
          // Use 'db' (or remove this property as it is default) to store data directly as JSON object in DB instead of files
          // dataStore: 'fs',
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
