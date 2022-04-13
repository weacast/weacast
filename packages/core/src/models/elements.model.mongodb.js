export default function (forecast, element, app, options) {
  options.Model = app.db.collection(`${forecast.name}-${element.name}`, element.dbName || forecast.dbName || options.dbName)
  // When a forecast is in the past we should not care anymore,
  // however it is still potentially valid at least until we reach the next forecast
  let expiration = element.ttl || forecast.ttl || element.interval || forecast.interval
  // Extend the expiration period if we need to keep past data
  if (element.keepPastRuns || forecast.keepPastRuns) expiration += element.oldestRunInterval || forecast.oldestRunInterval
  // Nota : adding a unique constraint on the field causes TTL not to work
  options.Model.createIndex({ forecastTime: 1 }, { expireAfterSeconds: expiration })
  // To perform geo queries on tiles
  options.Model.createIndex({ geometry: '2dsphere' })
  // To perform $exists requests
  options.Model.createIndex({ geometry: 1 })
  options.Model.createIndex({ x: 1, y: 1 })
  options.Model.createIndex({ forecastTime: 1, geometry: 1 })
}
