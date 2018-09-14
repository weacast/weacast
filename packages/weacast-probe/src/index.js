import path from 'path'
import mubsub from 'mubsub'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-probe')

export default function init () {
  let app = this
  const syncConfig = app.get('sync')
  // Setup sync with external loaders if any
  if (syncConfig) {
    debug('Initializing sync with external loaders with following config', syncConfig)
    let client = mubsub(syncConfig.url || app.get('db').url, syncConfig)
    app.sync = client.channel(syncConfig.collection || 'krawler-events')
  }

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
