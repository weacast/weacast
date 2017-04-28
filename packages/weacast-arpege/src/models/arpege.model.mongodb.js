module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(forecast.name + '-' + element.name)
  options.Model.ensureIndex({ runTimeOffset: 1 }, { unique: true })
  options.Model.ensureIndex({ forecastTime: -1 })
}
