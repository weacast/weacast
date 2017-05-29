import { marshall, unmarshall } from './marshall'
import { processForecastTime, marshallQuery, marshallComparisonQuery, marshallSpatialQuery, processData } from './query'

let hooks = {
  marshall,
  unmarshall,
  processForecastTime,
  marshallQuery,
  marshallComparisonQuery,
  marshallSpatialQuery,
  processData
}

export default hooks
