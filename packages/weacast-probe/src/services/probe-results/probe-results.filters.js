module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // We do not dispatch real-time events on results as we might have a lot of them
  // FIXME : create custom events to manage this as batches
  return false
}
