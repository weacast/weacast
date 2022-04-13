export default function (app, options) {
  options.Model = app.db.collection('probes', options.dbName)
}
