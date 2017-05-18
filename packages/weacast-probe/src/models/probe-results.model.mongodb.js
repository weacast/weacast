module.exports = function (app, options) {
  options.Model = app.db.collection('probe-results')
  options.Model.ensureIndex({ forecastTime: 1 }, { expireAfterSeconds: options.expireAfter || 3 * 3600 })
}
