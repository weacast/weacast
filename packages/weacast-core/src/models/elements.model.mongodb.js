module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(forecast.name + '-' + element.name)
  options.Model.ensureIndex({ runTime: 1 })
  // When a forecast is in the past we should not care anymore, however it is still valid at least
  // for forecast.interval / 2 duration because we always take the nearest forecast for any given time :
  // previous forecast <----- previous validity -----> forecast.interval / 2 <----- next validity ------> next forecast
  options.Model.ensureIndex({ forecastTime: 1 }, { unique: true }, { expireAfterSeconds : 0.5 * forecast.interval })
}
