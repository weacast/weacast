import chroma from 'chroma-js'
window.chroma = chroma

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
  // Compute nearest run T0, always in the past
  const h = roundHours(datetime.hours(), runInterval / 3600)
  return datetime.clone().hours(h).minutes(0).seconds(0).milliseconds(0)
}

/*
  Round hours to expected forecast interval
  @return {Date}
 */
export function getNearestForecastTime (datetime, interval) {
  // Compute nearest forecast T0, can be in the past when between two forecast time
  let offsetDateTime = datetime.clone().add({ seconds: 0.5 * interval })
  const h = roundHours(offsetDateTime.hours(), interval / 3600)
  return offsetDateTime.clone().hours(h).minutes(0).seconds(0).milliseconds(0)
}

/*
 Create a chromajs object from options
 */
export function createColorMap(options, domain) {
  let colorMap = chroma.scale(options.scale)
  if (options.domain) colorMap.domain(options.domain)
  else if (domain) colorMap.domain(domain)
  if (options.classes) colorMap.classes(options.classes)
  return colorMap
}
