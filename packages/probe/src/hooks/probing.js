// import makeDebug from 'debug'
import feathersHooks from 'feathers-hooks-common'
import mongo from 'mongodb'
import _ from 'lodash'

const { getItems, replaceItems, discard } = feathersHooks
const { ObjectID } = mongo

// const debug = makeDebug('weacast:weacast-probe')
const discardFeaturesField = discard('features')

export function marshallResultsQuery (hook) {
  const query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : string
    if ((hook.service.app.db.adapter === 'mongodb') && (typeof query.probeId === 'string')) {
      query.probeId = new ObjectID(query.probeId)
    }
  }
}

export async function aggregateResultsQuery (hook) {
  const query = hook.params.query
  if (query) {
    // Perform aggregation
    if (query.$aggregate) {
      const collection = hook.service.Model
      const ids = typeof query.$groupBy === 'string' // Group by matching ID(s), ie single ID or array of field to create a compound ID
        ? { [query.$groupBy.replace('properties.', '')]: '$' + query.$groupBy }
        // Aggregated in an accumulator to avoid conflict with feature properties
        : query.$groupBy.reduce((object, id) => Object.assign(object, { [id.replace('properties.', '')]: '$' + id }), {})
      const groupBy = {
        _id: ids,
        forecastTime: { $push: '$forecastTime' }, // Keep track of all forecast times
        runTime: { $push: '$runTime' }, // Keep track of all run times
        geometry: { $last: '$geometry' }, // geometry is similar for all results, keep last
        type: { $last: '$type' }, // type is similar for all results, keep last
        properties: { $last: '$properties' } // properties are similar for all results, keep last
      }
      // The query contains the match stage except options relevent to the aggregation pipeline
      const match = _.omit(query, ['$groupBy', '$aggregate'])
      // Ensure we do not mix results with/without relevant element values
      // by separately querying each element then merging
      let aggregatedResults
      await Promise.all(query.$aggregate.map(async element => {
        const elementResults = await collection.aggregate([
          // Find matching probre results only
          { $match: Object.assign({ ['properties.' + element]: { $exists: true } }, match) },
          // Ensure they are ordered by increasing forecast time and most recent forecast first
          { $sort: Object.assign({ forecastTime: 1, runTime: -1 }, query.$sort) },
          // Keep track of all element values
          { $group: Object.assign({ [element]: { $push: '$properties.' + element } }, groupBy) }
        ]).toArray()
        // Rearrange data so that we get ordered arrays indexed by element
        elementResults.forEach(result => {
          result.forecastTime = { [element]: result.forecastTime }
          result.runTime = { [element]: result.runTime }
          // Set back the element values as properties because we aggregated in an accumulator
          // to avoid conflict with probe properties
          result.properties[element] = result[element]
          // Delete accumulator
          delete result[element]
        })
        // Now merge
        if (!aggregatedResults) aggregatedResults = elementResults
        else {
          elementResults.forEach(result => {
            const previousResult = aggregatedResults.find(aggregatedResult => {
              const keys = _.keys(ids)
              return (_.isEqual(_.pick(aggregatedResult, keys), _.pick(result, keys)))
            })
            // Merge with previous matching feature if any
            if (previousResult) {
              Object.assign(previousResult.forecastTime, result.forecastTime)
              Object.assign(previousResult.runTime, result.runTime)
              previousResult.properties[element] = result.properties[element]
            } else {
              aggregatedResults.push(result)
            }
          })
        }
      }))
      delete query.$aggregate
      // Set result to avoid service DB call
      hook.result = aggregatedResults
    }
  }
  return hook
}

export function checkProbingType (hook) {
  const query = hook.params.query
  // When performing on-demand probing nothing will be created in the DB
  // Simply return the probe object to be used by hooks
  if (!_.isNil(query) && !_.isNil(query.forecastTime)) {
    hook.result = hook.data
  }
  // Otherwise let create the probe object
  return hook
}

export async function performProbing (hook) {
  const query = hook.params.query

  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  const probePromises = []
  items.forEach(item => {
    probePromises.push(hook.service.probe(item, query))
  })

  await Promise.all(probePromises)
  replaceItems(hook, isArray ? items : items[0])
  return hook
}

export async function removeResults (hook) {
  const resultService = hook.service.app.getService('probe-results')
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])

  const removePromises = []
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
  const params = hook.params
  const query = params.query

  // Only discard if not explicitely asked by $select or when performing
  // on-demand probing (in this case the probing time is given)
  if (_.isNil(query) || (!(!_.isNil(query.$select) && query.$select.includes('features')) && _.isNil(query.forecastTime))) {
    discardFeaturesField(hook)
  }
}
