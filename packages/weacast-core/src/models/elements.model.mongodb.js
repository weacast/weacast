module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(`${forecast.name}-${element.name}`, element.dbName || forecast.dbName || options.dbName)
  // When a forecast is in the past we should not care anymore,
  // however it is still potentially valid at least until we reach the next forecast
  // Nota : adding a unique constraint on the field causes TTL not to work
  options.Model.ensureIndex({ forecastTime: 1 },
    { expireAfterSeconds: element.interval || element.ttl || forecast.interval || forecast.ttl })
  // To perform geo queries on tiles
  options.Model.ensureIndex({ geometry: '2dsphere' })
  // To perform $exists requests
  options.Model.ensureIndex({ geometry: 1 })
  options.Model.ensureIndex({ x: 1, y: 1 })
  options.Model.ensureIndex({ forecastTime: 1, geometry: 1 })
}
