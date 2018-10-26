module.exports = function (app, options) {
  options.Model = app.db.collection('alerts')
  // Expire at a given date
  options.Model.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
}
