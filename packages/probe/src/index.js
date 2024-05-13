import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import mubsub from 'mubsub-es'
import _ from 'lodash'
import makeDebug from 'debug'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const debug = makeDebug('weacast:weacast-probe')

export default async function init () {
  debug('Initializing weacast-probe')

  const app = this
  const syncConfig = app.get('sync')
  // Setup sync with external loaders if any
  if (syncConfig) {
    debug('Initializing sync with external loaders with following config', syncConfig)
    const client = mubsub(syncConfig.url || app.get('db').url, _.omit(syncConfig, ['url']))
    app.sync = client.channel(syncConfig.collection || 'krawler-events')
  }

  // Setup custom events as service options
  const probesService = await app.createService('probes',
    path.join(__dirname, 'models'),
    path.join(__dirname, 'services'), Object.assign({
      events: ['results'],
      distributedEvents: ['results']
    }, app.getServiceOptions('probes')))
  await app.createService('probe-results',
    path.join(__dirname, 'models'),
    path.join(__dirname, 'services'), Object.assign({
    // There is no real way to disable default events in Feathers v3 (see https://github.com/feathersjs/feathers/issues/922)
    // This is actually handled by hooks on the service itself
      events: [],
      distributedEvents: []
    }, app.getServiceOptions('probe-results')))

  // Create default probes if not already done
  const defaultProbes = app.get('defaultProbes')
  if (defaultProbes) {
    const defaultElementFilter = (forecast) => forecast.elements.map(element => element.name)
    const probes = await probesService.find({ paginate: false, query: { $select: ['_id', 'name', 'forecast'] } })
    for (const defaultProbe of defaultProbes) {
      const probeName = path.parse(defaultProbe.fileName).name
      for (const forecast of app.get('forecasts')) {
        const createdProbe = probes.find(probe => (probe.name === probeName) && (probe.forecast === forecast.name))
        if (!createdProbe) {
          // One probe for each forecast model and elements except if custom filter provided
          const elementFilter = defaultProbe.filter || defaultElementFilter
          app.logger.info('Initializing default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
          const options = Object.assign({
            name: probeName,
            forecast: forecast.name,
            elements: elementFilter(forecast)
          }, defaultProbe.options)
          if (options.elements.length > 0) {
            const geojson = fs.readJsonSync(defaultProbe.fileName)
            Object.assign(geojson, options)
            const probe = await probesService.create(geojson)
            app.logger.info('Initialized default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
            probes.push(probe)
          } else {
            app.logger.info('Skipping default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name + ' (no target elements)')
          }
        }
      }
    }
  }

  // On startup restore listeners for forecast data updates required to update probe results
  if (probesService) {
    const probes = await probesService.find({ paginate: false })
    probes.forEach(probe => probesService.registerForecastUpdates(probe))
  }
}
