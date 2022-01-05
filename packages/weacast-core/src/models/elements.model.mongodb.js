module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(`${forecast.name}-${element.name}`, element.dbName || forecast.dbName || options.dbName)
  // When a forecast is in the past we should not care anymore,
  // however it is still potentially valid at least until we reach the next forecast
  // Nota : adding a unique constraint on the field causes TTL not to work
  options.Model.createIndex({ forecastTime: 1 },
    { expireAfterSeconds: element.ttl || element.interval || forecast.ttl || forecast.interval })
  // To perform geo queries on tiles
  options.Model.createIndex({ geometry: '2dsphere' })
  // To perform $exists requests
  options.Model.createIndex({ geometry: 1 })
  options.Model.createIndex({ x: 1, y: 1 })
  options.Model.createIndex({ forecastTime: 1, geometry: 1 })
}
