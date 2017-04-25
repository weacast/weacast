module.exports = function (element, app, options) {
  options.name = element.name
  options.Model = app.db.collection(element.name);
};
