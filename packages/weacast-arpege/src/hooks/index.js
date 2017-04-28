import { marshall, unmarshall } from './marshall'
import { nearestForecastTime } from './query'

let hooks = {
  marshall,
  unmarshall,
  nearestForecastTime
}

export default hooks
