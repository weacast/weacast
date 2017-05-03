import { marshall, unmarshall } from './marshall'
import { nearestForecastTime, marshallQuery, discardData } from './query'

let hooks = {
  marshall,
  unmarshall,
  nearestForecastTime,
  marshallQuery,
  discardData
}

export default hooks
