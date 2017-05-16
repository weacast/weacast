// import logger from 'winston'
// import makeDebug from 'debug'
import { getItems, replaceItems } from 'feathers-hooks-common'

// const debug = makeDebug('weacast:weacast-core')

export function performProbing (hook) {
  return new Promise((resolve, reject) => {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])

    let probePromises = []
    items.forEach(item => {
      probePromises.push(hook.service.probe(item))
    })

    Promise.all(probePromises).then(_ => {
      replaceItems(hook, isArray ? items : items[0])
      resolve(hook)
    })
  })
}
