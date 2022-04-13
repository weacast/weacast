export default function (app, options) {
  options.Model = app.db.collection('probe-results', options.dbName)
  options.Model.createIndex({ forecastTime: 1 }, { expireAfterSeconds: options.expireAfter || options.ttl || 6 * 3600 })
  options.Model.createIndex({ geometry: '2dsphere' })
  options.Model.createIndex({ probeId: 1 })
  options.Model.createIndex({ forecastTime: 1, probeId: 1 })
}
