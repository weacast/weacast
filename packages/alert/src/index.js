import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import makeDebug from 'debug'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const debug = makeDebug('weacast:weacast-alert')

export default async function init () {
  debug('Initializing weacast-alert')
  const app = this

  // Setup custom events as service options
  const alertsService = await app.createService('alerts',
    path.join(__dirname, 'models'),
    path.join(__dirname, 'services'), Object.assign({
      events: ['alerts']
    }, app.getServiceOptions('alerts')))

  // Create default alerts if not already done
  const defaultAlerts = app.get('defaultAlerts')
  if (defaultAlerts) {
    const defaultProbeFilter = (probe) => true
    const alerts = await alertsService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
    for (const defaultAlert of defaultAlerts) {
      const alertName = path.parse(defaultAlert.fileName).name
      const createdAlert = alerts.find(alert => alert.name === alertName)
      if (!createdAlert) {
        // One alert for each probe except if custom filter provided
        const probes = await app.getService('probes').find({ paginate: false, query: { $select: ['_id', 'name'] } })
        const probeFilter = defaultAlert.filter || defaultProbeFilter
        for (const probe of probes) {
          if (typeof probeFilter === 'function' && !probeFilter(probe)) {
            app.logger.info('Skipping default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
            continue
          }
          app.logger.info('Initializing default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
          const geojson = fs.readJsonSync(defaultAlert.fileName)
          const options = Object.assign({
            name: alertName,
            probeId: probe._id
          }, defaultAlert.options)
          Object.assign(options.conditions, { geometry: { $geoWithin: { $geometry: geojson.geometry } } })
          await alertsService.create(options)
          app.logger.info('Initialized default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
        }
      }
    }
  }

  // On startup restore alerts CRON tasks
  if (alertsService) {
    const alerts = await alertsService.find({ paginate: false })
    alerts.forEach(alert => alertsService.registerAlert(alert))
  }
}
