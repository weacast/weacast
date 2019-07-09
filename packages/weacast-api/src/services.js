import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import logger from 'winston'
import core, { initializeElements } from 'weacast-core'
import probe from 'weacast-probe'
import alert from 'weacast-alert'

const modelPath = path.join(__dirname, 'models')
const servicePath = path.join(__dirname, 'services')

module.exports = async function () {
  const app = this
  const authConfig = app.get('authentication')
  // Setup app services
  try {
    if (authConfig) app.createService('users', modelPath, servicePath)
    app.configure(core)
    // Setup if we use local loaders
    const loaders = app.get('loaders')
    if (loaders && loaders.length > 0) {
      // Setup loader plugins by dynamically require them
      loaders.forEach(loader => {
        const plugin = require(`weacast-${loader}`)
        app.configure(plugin)
      })
    } else { 
      // Set up only elements services otherwise
      const forecasts = app.get('forecasts')
      // Iterate over configured forecast models
      for (let i = 0; i < forecasts.length; i++) {
        await initializeElements(app, forecasts[i])
      }
    }
    app.configure(probe)
    app.configure(alert)
  }
  catch (error) {
    logger.error(error.message)
  }

  // Create default users if not already done
  let usersService = app.getService('users')
  if (usersService && authConfig) {
    let defaultUsers = authConfig.defaultUsers
    if (defaultUsers) {
      const users = await usersService.find({ paginate: false })
      defaultUsers.forEach(defaultUser => {
        let createdUser = users.find(user => user.email === defaultUser.email)
        if (!createdUser) {
          logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
          usersService.create({ email: defaultUser.email, password: defaultUser.password })
        }
      })
    }
  }

  let probesService = app.getService('probes')
  let alertsService = app.getService('alerts')

  // Create default probes if not already done
  let defaultProbes = app.get('defaultProbes')
  if (defaultProbes) {
    const defaultElementFilter = (forecast) => forecast.elements.map(element => element.name)
    let probes = await probesService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
    for (let defaultProbe of defaultProbes) {
      const probeName = path.parse(defaultProbe.fileName).name
      let createdProbe = probes.find(probe => probe.name === probeName)
      if (!createdProbe) {
        // One probe for each forecast model and elements except if custom filter provided
        const elementFilter = defaultProbe.filter || defaultElementFilter
        for (let forecast of app.get('forecasts')) {
          logger.info('Initializing default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
          let options = Object.assign({
            name: probeName,
            forecast: forecast.name,
            elements: elementFilter(forecast)
          }, defaultProbe.options)
          if (options.elements.length > 0) {
            let geojson = fs.readJsonSync(defaultProbe.fileName)
            Object.assign(geojson, options)
            const probe = await probesService.create(geojson)
            logger.info('Initialized default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
            probes.push(probe)
          } else {
            logger.info('Skipping default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name + ' (no target elements)')
          }
        }
      }
    }
    // Create default alerts if not already done
    let defaultAlerts = app.get('defaultAlerts')
    if (defaultAlerts) {
      const defaultProbeFilter = (probe) => true
      const alerts = await alertsService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
      for (let defaultAlert of defaultAlerts) {
        const alertName = path.parse(defaultAlert.fileName).name
        let createdAlert = alerts.find(alert => alert.name === alertName)
        if (!createdAlert) {
          // One alert for each probe except if custom filter provided
          const probeFilter = defaultAlert.filter || defaultProbeFilter
          for (let probe of probes) {
            if (typeof probeFilter === 'function' && !probeFilter(probe)) {
              logger.info('Skipping default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
              continue
            }
            logger.info('Initializing default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
            let geojson = fs.readJsonSync(defaultAlert.fileName)
            let options = Object.assign({
              name: alertName,
              probeId: probe._id
            }, defaultAlert.options)
            Object.assign(options.conditions, { geometry: { $geoWithin: { $geometry: geojson.geometry } } })
            await alertsService.create(options)
            logger.info('Initialized default alert ' + defaultAlert.fileName + ' for probe ' + probe._id)
          }
        }
      }
    }
  }
}
