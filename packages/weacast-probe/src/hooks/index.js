import { marshallResultQuery, checkProbingType, performProbing, removeResults, removeFeatures } from './probing'

let hooks = {
  marshallResultQuery,
  checkProbingType,
  performProbing,
  removeResults,
  removeFeatures
}

export default hooks
