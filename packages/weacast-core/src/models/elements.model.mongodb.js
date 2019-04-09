module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(`${forecast.name}-${element.name}`)
  // When a forecast is in the past we should not care anymore,
  // however it is still potentially valid at least until we reach the next forecast
  // Nota : adding a unique constraint on the field causes TTL not to work
  options.Model.ensureIndex({ forecastTime: 1 }, { expireAfterSeconds: element.interval || forecast.interval })
  // To perform geo queries on tiles
  options.Model.ensureIndex({ geometry: '2dsphere' })
  options.Model.ensureIndex({ x: 1, y: 1 })
  options.Model.ensureIndex({ forecastTime: 1, geometry: 1 })
}
