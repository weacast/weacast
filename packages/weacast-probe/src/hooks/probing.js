// import logger from 'winston'
// import makeDebug from 'debug'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { ObjectID } from 'mongodb'

// const debug = makeDebug('weacast:weacast-core')

export function marshallResultQuery (hook) {
  let query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : string
    if ((hook.service.app.db.adapter === 'mongodb') && (typeof query.probeId === 'string')) {
      query.probeId = new ObjectID(query.probeId)
    }
    if (query.centerLon && query.centerLat && query.distance) {
      let lon = (typeof query.centerLon === 'string' ? parseFloat(query.centerLon) : query.centerLon)
      let lat = (typeof query.centerLat === 'string' ? parseFloat(query.centerLat) : query.centerLat)
      let d = (typeof query.distance === 'string' ? parseFloat(query.distance) : query.distance)
      // Transform to MongoDB spatial request
      delete query.centerLon
      delete query.centerLat
      delete query.distance
      query.geometry = {
        $near: {
          $geometry: {
            type: 'Point' ,
            coordinates: [lon, lat]
          },
          $maxDistance: d
        }
      }
    }
  }
}

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

export function removeResults (hook) {
  return new Promise((resolve, reject) => {
    let resultService = hook.service.app.getService('probe-results')
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])

    let removePromises = []
    items.forEach(item => {
      removePromises.push(resultService.remove(null, {
        query: {
          probeId: item._id
        }
      }))
    })

    Promise.all(removePromises).then(_ => {
      resolve(hook)
    })
  })
}
