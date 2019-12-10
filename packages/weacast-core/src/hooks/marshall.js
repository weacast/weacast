import moment from 'moment'
import _ from 'lodash'
import { getItems, replaceItems } from 'feathers-hooks-common'

// Helper function to convert time objects or array of time objects
export function marshallTime (item, property) {
  if (!item) return
  const time = item[property]
  if (!time) return
  if (Array.isArray(time)) {
    item[property] = time.map(t => {
      if (moment.isMoment(t)) return new Date(t.format())
      else if (typeof t === 'string') return new Date(t)
      else return t
    })
  } else if (moment.isMoment(time)) {
    item[property] = new Date(time.format())
  } else if (typeof time === 'string') {
    item[property] = new Date(time)
  } else if (typeof time === 'object') { // Check if complex object such as comparison operator
    // If so this will recurse
    _.keys(time).forEach(key => marshallTime(time, key))
  }
}

// Helper function to convert time objects or array of time objects
export function unmarshallTime (item, property) {
  if (!item) return
  const time = item[property]
  if (!time) return
  if (Array.isArray(time)) {
    item[property] = time.map(t => {
      if (typeof time === 'string') return moment.utc(time)
      else if (typeof time.toISOString === 'function') return moment.utc(time.toISOString())
      else return t
    })
  } else if (!moment.isMoment(time)) {
    if (typeof time === 'string') item[property] = moment.utc(time)
    else if (typeof time.toISOString === 'function') item[property] = moment.utc(time.toISOString())
    // Recurse on complex object such as comparison operator
    else if (typeof time === 'object') _.keys(time).forEach(key => unmarshallTime(time, key))
  }
}

// Need to convert from server side types (moment dates) to basic JS types when "writing" to DB adapters
export function marshall (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  items.forEach(item => {
    marshallTime(item, 'runTime')
    marshallTime(item, 'forecastTime')
  })

  replaceItems(hook, isArray ? items : items[0])
}

// Need to convert back to server side types (moment dates) from basic JS types when "reading" from DB adapters
export function unmarshall (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  items.forEach(item => {
    unmarshallTime(item, 'runTime')
    unmarshallTime(item, 'forecastTime')
  })

  replaceItems(hook, isArray ? items : items[0])
}
