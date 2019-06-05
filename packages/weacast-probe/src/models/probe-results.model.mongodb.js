module.exports = function (app, options) {
  options.Model = app.db.collection('probe-results', options.dbName)
  options.Model.ensureIndex({ forecastTime: 1 }, { expireAfterSeconds: options.expireAfter || 6 * 3600 })
  options.Model.ensureIndex({ geometry: '2dsphere' })
  options.Model.ensureIndex({ probeId: 1 })
}
