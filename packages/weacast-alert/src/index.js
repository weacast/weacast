import path from 'path'
import fs from 'fs-extra'
import logger from 'winston'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-alert')

export default async function init () {
  debug('Initializing weacast-alert')
  let app = this

  // Setup custom events as service options
  let alertsService = app.createService('alerts',
  	path.join(__dirname, 'models'),
  	path.join(__dirname, 'services'), Object.assign({
    events: ['alerts']
  }, app.getServiceOptions('alerts')))

  // Create default alerts if not already done
  let defaultAlerts = app.get('defaultAlerts')
  if (defaultAlerts) {
    const defaultProbeFilter = (probe) => true
    const alerts = await alertsService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
    for (let defaultAlert of defaultAlerts) {
      const alertName = path.parse(defaultAlert.fileName).name
      let createdAlert = alerts.find(alert => alert.name === alertName)
      if (!createdAlert) {
        // One alert for each probe except if custom filter provided
        let probes = await app.getService('probes').find({ paginate: false, query: { $select: ['_id', 'name'] } })
        const probeFilter = defaultAlert.filter || defaultProbeFilter
        for (let probe of probes) {
          if (typeof probeFilter === 'function' && !probeFilter(probe)) {
            logger.info('Skipping default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
            continue
          }
          logger.info('Initializing default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
          let geojson = fs.readJsonSync(defaultAlert.fileName)
          let options = Object.assign({
            name: alertName,
            probeId: probe._id
          }, defaultAlert.options)
          Object.assign(options.conditions, { geometry: { $geoWithin: { $geometry: geojson.geometry } } })
          await alertsService.create(options)
          logger.info('Initialized default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
        }
      }
    }
  }

  // On startup restore alerts CRON tasks
  if (alertsService) {
  	let alerts = await alertsService.find({ paginate: false })
  	alerts.forEach(alert => alertsService.registerAlert(alert))
  }
}
