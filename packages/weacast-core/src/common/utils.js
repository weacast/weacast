/*
  Round hours to expected interval, e.g. we're currently using 6 hourly interval i.e. 00 || 06 || 12 || 18
  @return {Number}
 */
export function roundHours (hours, interval) {
  return (Math.floor(hours / interval) * interval)
}

/*
  Round hours to expected run interval
  @return {Date}
 */
export function getNearestRunTime (datetime, runInterval) {
  // Compute nearest run T0
  return datetime.clone().hours(roundHours(datetime.hours(), runInterval / 3600)).minutes(0).seconds(0).milliseconds(0)
}

/*
  Round hours to expected forecasr interval
  @return {Date}
 */
export function getNearestForecastTime (datetime, interval) {
	// Compute nearest forecast T0
	let offsetDateTime = datetime.clone().add({ seconds: 0.5 * interval })
	return datetime.clone().hours(roundHours(offsetDateTime.hours(), interval / 3600)).minutes(0).seconds(0).milliseconds(0)
}
