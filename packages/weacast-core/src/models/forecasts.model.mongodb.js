module.exports = function (app, options) {
  options.Model = app.db.collection('forecasts', options.dbName)
  options.Model.createIndex({ name: 1 }, { unique: true })
}
