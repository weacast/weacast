import { marshall, unmarshall } from './marshall'
import { processForecastTime, marshallQuery, marshallSpatialQuery, processData } from './query'

let hooks = {
  marshall,
  unmarshall,
  processForecastTime,
  marshallQuery,
  marshallSpatialQuery,
  processData
}

export default hooks
