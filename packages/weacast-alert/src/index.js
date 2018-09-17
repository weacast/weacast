import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('weacast:weacast-alert')

export default function init () {
  let app = this

  // Setup custom events as service options
  let alertsService = app.createService('alerts', path.join(__dirname, 'models'), path.join(__dirname, 'services'), {
    events: ['alert']
  })
  
  // On startup restore alerts CRON tasks
  alertsService.find({ paginate: false })
  .then(alerts => {
    alerts.forEach(alert => {
      alertsService.registerAlert(alert)
    })
  })
}
