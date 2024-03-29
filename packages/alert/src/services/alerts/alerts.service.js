import _ from 'lodash'
import moment from 'moment'
import sift from 'sift'
import { CronJob } from 'cron'
import makeDebug from 'debug'
const debug = makeDebug('weacast:weacast-alert:service')

// Alert map
const alerts = {}

export default {

  async registerAlert (alert) {
    if (alerts[alert._id.toString()]) return
    debug('Registering new alert ', alert)
    const cronJob = new CronJob(alert.cron, () => this.checkAlert(alert))
    alerts[alert._id.toString()] = cronJob
    await this.checkAlert(alert)
    cronJob.start()
  },

  async unregisterAlert (alert) {
    const cronJob = alerts[alert._id.toString()]
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
    const query = Object.assign({
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
    const query = Object.assign({
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
    const result = await probesService.create({
      forecast: alert.forecast,
      elements: alert.elements
    }, { query })
    // Let sift performs condition matching as in this case MongoDB cannot
    const results = result.features.filter(sift(conditions))
    return results
  },

  async checkAlert (alert) {
    const now = moment.utc()
    debug('Checking alert at ' + now.format(), _.omit(alert, ['status']))
    // First check if still valid
    if (now.isAfter(alert.expireAt)) {
      await this.unregisterAlert(alert)
      return
    }
    const results = (alert.probeId ? await this.checkStreamAlert(alert) : await this.checkOnDemandAlert(alert))
    // FIXME: check for a specific duration where conditions are met
    const isActive = (results.length > 0)
    const wasActive = _.get(alert, 'status.active')
    // Then update alert status
    const status = {
      active: isActive,
      checkedAt: now.clone()
    }
    if (isActive) {
      // If not previously active and it is now add first time stamp
      if (!wasActive) {
        status.triggeredAt = now.clone()
      } else { // Else keep track of previous trigger time stamp
        status.triggeredAt = _.get(alert, 'status.triggeredAt').clone()
      }
    }
    debug('Alert ' + alert._id.toString() + ' status', status, ' with ' + results.length + ' triggers')
    // Emit event
    const event = { alert }
    if (isActive) event.triggers = results
    // As we keep in-memory objects avoid them being mutated by hooks processing operation payload
    await this.patch(alert._id.toString(), { status: Object.assign({}, status) })
    // Keep track of changes in memory as well
    Object.assign(alert, { status })
    this.emit('alerts', event)
  }
}
