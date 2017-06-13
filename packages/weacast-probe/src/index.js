import path from 'path'

export default function init () {
  let app = this

  // Setup custom events as service options
  let probesService = app.createService('probes', path.join(__dirname, 'models'), path.join(__dirname, 'services'), {
    events: ['results']
  })
  app.createService('probe-results', path.join(__dirname, 'models'), path.join(__dirname, 'services'))

  // On startup restore listeners for forecast data updates required to update probe results
  probesService.find({ paginate: false })
  .then(probes => {
    probes.forEach(probe => {
      probesService.registerForecastUpdates(probe)
    })
  })
}
