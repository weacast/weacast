import path from 'path'
import mubsub from 'mubsub'
import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-probe')

export default async function init () {
  debug('Initializing weacast-probe')

  let app = this
  const syncConfig = app.get('sync')
  // Setup sync with external loaders if any
  if (syncConfig) {
    debug('Initializing sync with external loaders with following config', syncConfig)
    let client = mubsub(syncConfig.url || app.get('db').url, _.omit(syncConfig, ['url']))
    app.sync = client.channel(syncConfig.collection || 'krawler-events')
  }

  // Setup custom events as service options
  let probesService = app.createService('probes',
    path.join(__dirname, 'models'),
    path.join(__dirname, 'services'), Object.assign({
    events: ['results'],
    distributedEvents: ['results']
  }, app.getServiceOptions('probes')))
  app.createService('probe-results',
    path.join(__dirname, 'models'),
    path.join(__dirname, 'services'), Object.assign({
    // There is no real way to disable default events in Feathers v3 (see https://github.com/feathersjs/feathers/issues/922)
    // This is actually handled by hooks on the service itself
    events: [],
    distributedEvents: []
  }, app.getServiceOptions('probe-results')))

  // On startup restore listeners for forecast data updates required to update probe results
  if (probesService) {
    const probes = await probesService.find({ paginate: false })
    probes.forEach(probe => probesService.registerForecastUpdates(probe))
  }
}
