import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-alert')

export default async function init () {
  let app = this

  // Setup custom events as service options
  let alertsService = app.createService('alerts', path.join(__dirname, 'models'), path.join(__dirname, 'services'), {
    events: ['alerts']
  })
  
  // On startup restore alerts CRON tasks
  let alerts = await alertsService.find({ paginate: false })
  alerts.forEach(alert => alertsService.registerAlert(alert))
}
