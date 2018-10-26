// import logger from 'winston'
// import makeDebug from 'debug'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { hooks } from 'weacast-core'
// const debug = makeDebug('weacast:weacast-core')

// Need to convert from server side types (moment dates) to basic JS types when "writing" to DB adapters
export function marshallAlert (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  items.forEach(item => {
    hooks.marshallTime(item, 'expireAt')
    hooks.marshallTime(item.status, 'checkedAt')
    hooks.marshallTime(item.status, 'triggeredAt')
    // Because conditions contains Mongo reserved keywords we have to serialize them otherwise it raises error
    if (item.conditions) item.conditions = JSON.stringify(item.conditions)
  })

  replaceItems(hook, isArray ? items : items[0])
}

// Need to convert back to server side types (moment dates) from basic JS types when "reading" from DB adapters
export function unmarshallAlert (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  items.forEach(item => {
    hooks.unmarshallTime(item, 'expireAt')
    hooks.unmarshallTime(item.status, 'checkedAt')
    hooks.unmarshallTime(item.status, 'triggeredAt')
    // Because we serialize conditions we have to unserialize them
    if (item.conditions) item.conditions = JSON.parse(item.conditions)
  })

  replaceItems(hook, isArray ? items : items[0])
}
