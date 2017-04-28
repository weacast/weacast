module.exports = function (forecast, element, app, options) {
  options.name = element.name
  options.db = app.db.collection(forecast.name + '-' + element.name)
  //options.idField = 'runTimeOffset'
  //options.sortField = 'runTimeOffset'
};
