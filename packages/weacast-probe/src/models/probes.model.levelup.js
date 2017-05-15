module.exports = function (app, options) {
  options.db = app.db.collection('probes')
  // options.idField = '_id'
}
