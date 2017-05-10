module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(forecast.name + '-' + element.name)
  // When a forecast is in the past we should not care anymore, however it is still valid at least
  // for forecast.interval / 2 duration because we always take the nearest forecast for any given time :
  // previous forecast <----- previous validity -----> forecast.interval / 2 <----- next validity ------> next forecast
  // Nota : adding a unique constraint on the field causes TTL not to work
  options.Model.ensureIndex({ forecastTime: 1 }, { expireAfterSeconds: 0.5 * forecast.interval })
  options.Model.ensureIndex({ runTime: 1 })
}
