import { marshall, unmarshall } from './marshall'
import { processForecastTime, marshallQuery, marshallComparisonQuery, marshallSpatialQuery, processData } from './query'
import { log } from './logger'

let hooks = {
  log,
  marshall,
  unmarshall,
  processForecastTime,
  marshallQuery,
  marshallComparisonQuery,
  marshallSpatialQuery,
  processData
}

export default hooks
