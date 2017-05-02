import { marshall, unmarshall } from './marshall'
import { nearestForecastTime, marshallQuery } from './query'

let hooks = {
  marshall,
  unmarshall,
  nearestForecastTime,
  marshallQuery
}

export default hooks
