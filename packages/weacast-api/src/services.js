import path from 'path'
import fs from 'fs-extra'
import logger from 'winston'
import core, { initializeElements } from 'weacast-core'
import probe from 'weacast-probe'
import alert from 'weacast-alert'

const modelPath = path.join(__dirname, 'models')
const servicePath = path.join(__dirname, 'services')

module.exports = async function () {
  const app = this
  // Setup app services
  try {
    let usersService = app.createService('users', modelPath, servicePath)
    app.configure(core)
    // Setup if we use local loaders
    const loaders = app.get('loaders')
    if (loaders && loaders.length > 0) {
      // Setup plugins by dynamically require them
      loaders.forEach(loader => {
        const plugin = require(`weacast-${loader}`)
        app.configure(plugin)
      })
    } else { 
      // Set up elements services
      const forecasts = app.get('forecasts')
      // Iterate over configured forecast models
      for (let forecast of forecasts) {
        initializeElements(app, forecast)
      }
    }
    app.configure(probe)
    app.configure(alert)
  }
  catch (error) {
    logger.error(error.message)
  }

  // Create default users if not already done
  const authConfig = app.get('authentication')
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
    let probes = await probesService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
    for (let defaultProbe of defaultProbes) {
      const probeName = path.parse(defaultProbe.fileName).name
      let createdProbe = probes.find(probe => probe.name === probeName)
      if (!createdProbe) {
        // One probe for each forecast model and elements
        for (let forecast of app.get('forecasts')) {
          logger.info('Initializing default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
          let geojson = fs.readJsonSync(defaultProbe.fileName)
          let options = Object.assign({
            name: probeName,
            forecast: forecast.name,
            elements: forecast.elements.map(element => element.name)
          }, defaultProbe.options)
          Object.assign(geojson, options)
          const probe = await probesService.create(geojson)
          logger.info('Initialized default probe ' + defaultProbe.fileName + ' for forecast model ' + forecast.name)
          probes.push(probe)
        }
      }
    }
    // Create default alerts if not already done
    let defaultAlerts = app.get('defaultAlerts')
    if (defaultAlerts) {
      const alerts = await alertsService.find({ paginate: false, query: { $select: ['_id', 'name'] } })
     for (let defaultAlert of defaultAlerts) {
        const alertName = path.parse(defaultAlert.fileName).name
        let createdAlert = alerts.find(alert => alert.name === alertName)
        if (!createdAlert) {
          // One alert for each probe
          for (let probe of probes) {
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
