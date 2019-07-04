import _ from 'lodash'
import moment from 'moment'
import sift from 'sift'
import { CronJob } from 'cron'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-alert:service')

// Alert map
let alerts = {}

export default {

  registerAlert (alert) {
    if (alerts[alert._id.toString()]) return
    debug('Registering new alert ', alert)
    let cronJob = new CronJob(alert.cron, () => this.checkAlert(alert))
    cronJob.start()
    alerts[alert._id.toString()] = cronJob
  },

  unregisterAlert (alert) {
    let cronJob = alerts[alert._id.toString()]
    if (!cronJob) return
    debug('Unregistering new alert ', alert)
    cronJob.stop()
    delete alerts[alert._id.toString()]
  },

  async checkStreamAlert (alert) {
    const now = moment.utc()
    // Convert conditions to internal data model
    const conditions = _.mapKeys(alert.conditions, (value, key) => {
      return (alert.elements.includes(key) ? 'properties.' + key : key)
    })
    const probeResultService = this.app.getService('probe-results')
    // Perform aggregation over time range
    let query = Object.assign({
      probeId: alert.probeId,
      forecastTime: {
        $gte: now.clone().add(_.get(alert, 'period.start', { seconds: 0 })).toDate(),
        $lte: now.clone().add(_.get(alert, 'period.end', { seconds: 24 * 3600 })).toDate()
      },
      $groupBy: alert.featureId,
      $aggregate: alert.elements
    }, conditions)
    const results = await probeResultService.find({ paginate: false, query })
    return results
  },

  async checkOnDemandAlert (alert) {
    const now = moment.utc()
    // Retrieve geometry
    const geometry = _.get(alert, 'conditions.geometry')
    // Convert conditions to internal data model
    const conditions = _.mapKeys(_.omit(alert.conditions, ['geometry']), (value, key) => {
      return (alert.elements.includes(key) ? 'properties.' + key : key)
    })
    const probesService = this.app.getService('probes')
    // Perform aggregation over time range
    let query = Object.assign({
      forecastTime: {
        $gte: now.clone().add(_.get(alert, 'period.start', { seconds: 0 })).toDate(),
        $lte: now.clone().add(_.get(alert, 'period.end', { seconds: 24 * 3600 })).toDate()
      },
      geometry: {
        $geoIntersects: {
          $geometry: geometry
        }
      },
      aggregate: false
    })
    let result = await probesService.create({
      forecast: alert.forecast,
      elements: alert.elements
    }, { query })
    // Let sift performs condition matching as in this case MongoDB cannot
    let results = result.features.filter(sift(conditions))
    return results
  },

  async checkAlert (alert) {
    const now = moment.utc()
    debug('Checking alert at ' + now.format(), _.omit(alert, ['status']))
    // First check if still valid
    if (now.isAfter(alert.expireAt)) {
      this.unregisterAlert(alert)
      return
    }
    const results = (alert.probeId ? await this.checkStreamAlert(alert) : await this.checkOnDemandAlert(alert))
    // FIXME: check for a specific duration where conditions are met
    const isActive = (results.length > 0)
    const wasActive = _.get(alert, 'status.active')
    // Then update alert status
    let status = {
      active: isActive,
      checkedAt: now
    }
    // If not previously active and it is now add first time stamp
    if (!wasActive && isActive) {
      status.triggeredAt = now
    } else if (wasActive) { // Else keep track of trigger time stamp
      status.triggeredAt = _.get(alert, 'status.triggeredAt')
    }
    debug('Alert ' + alert._id.toString() + ' status', status, results)
    // Emit event
    let event = { alert }
    if (isActive) event.triggers = results
    const result = await this.patch(alert._id.toString(), { status })
    // Keep track of changes in memory as well
    Object.assign(alert, result)
    this.emit('alerts', event)
  }
}
