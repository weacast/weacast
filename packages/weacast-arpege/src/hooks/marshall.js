import moment from 'moment'
import { getItems, replaceItems } from 'feathers-hooks-common'

export function marshall (hook) {
  let items = getItems(hook)
  items = (Array.isArray(items) ? items : [items])

  items.forEach(item => {
    item.runTime = new Date(item.runTime.format())
    item.forecastTime = new Date(item.forecastTime.format())
  })

  replaceItems(hook, items)
}

export function unmarshall (hook) {
  let items = getItems(hook)
  items = (Array.isArray(items) ? items : [items])

  items.forEach(item => {
    // Take care to field selection that might remove some
    if (item.runTime) item.runTime = moment.utc(item.runTime.toISOString())
    if (item.forecastTime) item.forecastTime = moment.utc(item.forecastTime.toISOString())
  })

  replaceItems(hook, items)
}
