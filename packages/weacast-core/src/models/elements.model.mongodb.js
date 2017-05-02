module.exports = function (forecast, element, app, options) {
  options.Model = app.db.collection(forecast.name + '-' + element.name)
  options.Model.ensureIndex({ runTime: -1 })
  options.Model.ensureIndex({ forecastTime: -1 }, { unique: true })
}
