module.exports = function (app, options) {
  options.db = app.db.collection('probe-results')
  // options.idField = '_id'
}
