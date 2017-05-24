import path from 'path'

export default function init () {
  let app = this

  let probesService = app.createService('probes', path.join(__dirname, 'models'), path.join(__dirname, 'services'))
  app.createService('probe-results', path.join(__dirname, 'models'), path.join(__dirname, 'services'))

  // On startup restore listeners for forecast data updates required to update probe results
  probesService.find({ paginate: false })
  .then(probes => {
    probes.forEach(probe => {
      probesService.registerForecastUpdates(probe)
    })
  })
}
