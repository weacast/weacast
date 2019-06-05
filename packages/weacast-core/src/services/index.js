import path from 'path'

module.exports = function () {
  const app = this
  
  app.createService('forecasts',
    path.join(__dirname, '..', 'models'),
    path.join(__dirname, '..', 'services'),
    app.getServiceOptions('forecasts'))
}
