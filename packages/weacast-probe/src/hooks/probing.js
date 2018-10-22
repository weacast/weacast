// import logger from 'winston'
// import makeDebug from 'debug'
import { getItems, replaceItems, discard } from 'feathers-hooks-common'
import { ObjectID } from 'mongodb'
import _ from 'lodash'

// const debug = makeDebug('weacast:weacast-core')
const discardFeaturesField = discard('features')

export function marshallResultsQuery (hook) {
  let query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : string
    if ((hook.service.app.db.adapter === 'mongodb') && (typeof query.probeId === 'string')) {
      query.probeId = new ObjectID(query.probeId)
    }
  }
}

export async function aggregateResultsQuery (hook) {
  let query = hook.params.query
  if (query) {
    // Perform aggregation
    if (query.$aggregate) {
      const collection = hook.service.Model
      let groupBy = {
        _id: '$' + query.$groupBy, // Group by matching ID
        forecastTime: { $push: '$forecastTime' }, // Keep track of all forecast times
        geometry: { $last: '$geometry' }, // geometry is similar for all results, keep last
        properties: { $last: '$properties' } // properties are similar for all results, keep last
      }
      // Keep track of all element values
      query.$aggregate.forEach(element => {
        groupBy[element] = { $push: '$properties.' + element }
      })
      // The query contains the match stage except options relevent to the aggregation pipeline
      let match = _.omit(query, ['$groupBy', '$aggregate'])
      // Ensure we do not mix results with/without relevant element values
      query.$aggregate.forEach(element => {
        match['properties.' + element] = { $exists: true }
      })
      let results = await collection.aggregate([
        { $match: match },                  // Find matching probre results
        { $sort: { forecastTime: 1 } },   // Ensure they are ordered by increasing forecast time
        { $group: groupBy }                 // And grouped by unique ID
      ]).toArray()
      // Set back the element values as properties
      query.$aggregate.forEach(element => {
        results.forEach(result => {
          result.properties[element] = result[element]
          delete result[element]
        })
      })
      delete query.$aggregate
      // Set result to avoid service DB call
      hook.result = results
    }
  }
  return hook
}

export function checkProbingType (hook) {
  let query = hook.params.query
  // When performing on-demand probing nothing will be created in the DB
  // Simply return the probe object to be used by hooks
  if (!_.isNil(query) && !_.isNil(query.forecastTime)) {
    hook.result = hook.data
  }
  // Otherwise let create the probe object
  return hook
}

export async function performProbing (hook) {
  let query = hook.params.query

  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  let probePromises = []
  items.forEach(item => {
    probePromises.push(hook.service.probe(item, query))
  })

  await Promise.all(probePromises)
  replaceItems(hook, isArray ? items : items[0])
  return hook
}

export async function removeResults (hook) {
  let resultService = hook.service.app.getService('probe-results')
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  let removePromises = []
  items.forEach(item => {
    // We have to remove listeners for results update first
    hook.service.unregisterForecastUpdates(item)
    // Then result objects
    removePromises.push(resultService.remove(null, {
      query: {
        probeId: item._id
      }
    }))
  })

  await Promise.all(removePromises)
  return hook
}

export function removeFeatures (hook) {
  let params = hook.params
  let query = params.query

  // Only discard if not explicitely asked by $select or when performing
  // on-demand probing (in this case the probing time is given)
  if (_.isNil(query) || (!(!_.isNil(query.$select) && query.$select.includes('features')) && _.isNil(query.forecastTime))) {
    discardFeaturesField(hook)
  }
}
