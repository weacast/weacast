module.exports = function (forecast, element, app, options) {
  options.name = element.name
  options.Model = app.db.collection(forecast.name + '-' + element.name)
  // options.id = 'forecastTime'
}
