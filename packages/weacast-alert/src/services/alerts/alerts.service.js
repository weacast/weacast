import logger from 'winston'
import _ from 'lodash'
import moment from 'moment'
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

	async checkAlert (alert) {
		debug('Checking alert ', alert)
		const probeResultService = this.app.getService('probe-results')
		const now = moment.utc()
		// Convert conditions to internal data model and Mongo operators
		let conditions = _.mapKeys(alert.conditions, (value, key) => 'properties.' + key)
		const operators= [ 'gte', 'gt', 'lte', 'lt' ]
		conditions = _.mapValues(conditions, (value, key) =>
			_.mapKeys(value, (value, key) => operators.includes(key) ? '$' + key : key))
		// First perform aggregation over time range
		let query = Object.assign({
      probeId: alert.probeId,
      forecastTime: {
        $gte: now.add(_.get(alert, 'period.start', { seconds: 0 })).toDate(),
        $lte: now.clone().add(_.get(alert, 'period.end', { seconds: 24 * 3600 })).toDate()
      },
      $groupBy: alert.featureId,
      $aggregate: alert.elements
    }, conditions)
    console.log(await probeResultService.find({ paginate: false }))
    console.log(query)
    let results = await probeResultService.find({ paginate: false, query })
    console.log(results)
    // Then check for time period

    // Then flag alert
    //let status = { active: true }
    //await this.patch(alert._id.toString(), { status })
	}
}
