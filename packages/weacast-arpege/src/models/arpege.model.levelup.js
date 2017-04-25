module.exports = function (element, app, options) {
  options.name = element.name
  options.db = app.db.collection(element.name);
};
