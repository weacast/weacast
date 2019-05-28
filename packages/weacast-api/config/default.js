var path = require('path')
var containerized = require('containerized')()
const forecasts = require('./forecasts')

var API_PREFIX = '/api'
const port = process.env.PORT || process.env.HTTPS_PORT || 8081
const loaders = [] // To embed local loaders: ['arpege', 'arome', 'gfs']

module.exports = {
  host: process.env.HOSTNAME || 'localhost',
  port,
  /* To enable HTTPS
  https: {
    key: path.join(__dirname, 'server.key'),
    cert: path.join(__dirname, 'server.crt'),
    port: process.env.HTTPS_PORT || 8084
  },
  */
  apiPath: API_PREFIX,
  staticPath: (process.env.NODE_ENV === 'production' ? '../dist' : undefined),
  paginate: {
    default: 10,
    max: 50
  },
  logs: {
    Console: {
      colorize: true,
      level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : (process.env.NODE_ENV === 'development' ? 'verbose' : 'info')
    },
    DailyRotateFile: {
      dirname: path.join(__dirname, '..', 'logs'),
      filename: 'weacast-',
      datePattern: 'yyyy-MM-dd.log',
      maxDays: 5
      /* Possible in next version of the logger : see https://github.com/winstonjs/winston-daily-rotate-file/pull/45
      filename: path.join(__dirname, '..', 'logs'),
      datePattern: '/yyyy/MM/dd.log',
      createTree: true
      */
    }
  },
  db: {
    adapter: 'mongodb',
    path: path.join(__dirname, '..', 'db-data'),
    url: process.env.DB_URL || (containerized ? 'mongodb://mongodb:27017/weacast' : 'mongodb://127.0.0.1:27017/weacast')
  },
  loaders,
  sync: (loaders.length > 0 ? false : { url: process.env.SYNC_DB_URL || process.env.DB_URL }),
  defaultProbes: [
    {
      fileName: path.join(__dirname, '..', 'probe-data', 'ne_10m_airports.geojson'),
      options: {
        featureId: 'properties.iata_code'
      }
    }
  ],
  defaultAlerts: [
    {
      fileName: path.join(__dirname, '..', 'probe-data', 'paris.geojson'),
      options: {
        cron: '0 */1 * * * *', // Every minute
        expireAt: new Date(Date.now() + 99 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 99 years validity
        featureId: 'properties.iata_code',
        period: {
          start: { hours: 0 },
          end: { hours: 24 }
        },
        elements: [ 'windSpeed' ],
        conditions: {
          windSpeed: { $gte: 0 } // Set a large range so that we are sure it will trigger
        }
      }
    }
  ],
  forecastPath: path.join(__dirname, '..', 'forecast-data'),
  forecasts: [ forecasts.gfs05, forecasts.arpege05 ]
}
