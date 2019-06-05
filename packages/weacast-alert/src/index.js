import path from 'path'
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

  // On startup restore alerts CRON tasks
  if (alertsService) {
  	let alerts = await alertsService.find({ paginate: false })
  	alerts.forEach(alert => alertsService.registerAlert(alert))
  }
}
