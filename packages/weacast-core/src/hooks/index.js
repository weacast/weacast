import { marshall, unmarshall } from './marshall'
import { processForecastTime, marshallQuery, processData } from './query'

let hooks = {
  marshall,
  unmarshall,
  processForecastTime,
  marshallQuery,
  processData
}

export default hooks
