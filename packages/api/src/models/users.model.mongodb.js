module.exports = function (app, options) {
  options.Model = app.db.collection('users')
  options.Model.createIndex({ email: 1 }, { unique: true })
}
