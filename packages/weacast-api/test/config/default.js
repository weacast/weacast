const path = require('path')

// USe default app config
let config = require(path.join(__dirname, '../../config/default'))

// Simply changes outputs so we don't pollute DB, logs, etc.
config.logs.DailyRotateFile.dirname = path.join(__dirname, '..', 'logs')
config.db.url = config.db.url.replace('weacast', 'weacast-test')

module.exports = config
