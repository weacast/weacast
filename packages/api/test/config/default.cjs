const path = require('path')

// Set we use local loaders
process.env.LOADERS = 'arpege,gfs'

// Use default app config
const config = require(path.join(__dirname, '../../config/default.cjs'))

// Simply changes outputs so we don't pollute DB, logs, etc.
config.logs.DailyRotateFile.dirname = path.join(__dirname, '..', 'logs')
config.db.url = config.db.url.replace('weacast', 'weacast-test')
delete config.authentication.defaultUsers
config.services.healthcheckInterval = 2

module.exports = config
