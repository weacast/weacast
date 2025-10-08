import path from 'path'
import _ from 'lodash'
import { fileURLToPath } from 'url'
import errors from '@feathersjs/errors'
import core, { initializeElements } from '@weacast/core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelPath = path.join(__dirname, 'models')
const servicePath = path.join(__dirname, 'services')

export default async function () {
  const app = this
  const authConfig = app.get('authentication')
  const servicesConfig = app.get('services')
  const healthcheckInterval = _.get(servicesConfig, 'healthcheckInterval', 30) * 1000
  let lastError, checkRunning, checkCount
  // Check the whole chain from DB to services on a regular basis.
  async function checkServices () {
    const forecastsService = app.getService('forecasts')
    try {
      if (!forecastsService) throw new errors.GeneralError('Services check failed as forecasts service is not available')
      const forecasts = await forecastsService.find({ query: {}, paginate: false })
      const forecast = _.get(forecasts, '[0]', {})
      const element = _.get(forecast, 'elements[0]', {})
      const elementService = app.getService(`${forecast.name}/${element.name}`)
      if (!elementService) throw new errors.GeneralError('Services check failed as element service is not available')
      // Run a quick request to check for some item
      await elementService.find({ query: { $limit: 1 } })
      lastError = null
    } catch (error) {
      lastError = error
    }
  }
  // Setup app services
  try {
    // We monitor the whole chain from DB to services on a regular basis (30s by default).
    // This cannot be directly done inside the healthcheck endpoint as any
    // error will be catched by the unhandledRejection event instead.
    setInterval(checkServices, healthcheckInterval)
    // Healthcheck endpoint
    app.get(app.get('apiPath') + '/healthcheck', async (req, res) => {
      res.set('Content-Type', 'application/json')
      return (lastError ?
        res.status(500).json({ isRunning: true, areServicesRunning: false, error: lastError }) :
        res.status(200).json({ isRunning: true, areServicesRunning: true }))
    })
    if (authConfig) await app.createService('users', modelPath, servicePath)
    await app.configure(core)
    // Setup if we use local loaders
    const loaders = app.get('loaders')
    if (loaders && loaders.length > 0) {
      // Iterate over configured loaders
      for (let i = 0; i < loaders.length; i++) {
        // Setup loader plugins by dynamically require them
        try {
          const pluginModule = await import(`@weacast/${loaders[i]}`)
          const plugin = pluginModule.default
          await app.configure(plugin)
        } catch (error) {
          app.logger.error(error.message)
        }
      }
    } else {
      // Set up only elements services otherwise
      const forecasts = app.get('forecasts')
      // Iterate over configured forecast models
      for (let i = 0; i < forecasts.length; i++) {
        await initializeElements(app, forecasts[i])
      }
    }
    // Setup plugins
    const plugins = app.get('plugins')
    // Iterate over configured plugins
    for (let i = 0; i < plugins.length; i++) {
      // Setup loader plugins by dynamically require them
      try {
        const pluginModule = await import(`@weacast/${plugins[i]}`)
        const plugin = pluginModule.default
        await app.configure(plugin)
      } catch (error) {
        app.logger.error(error.message)
      }
    }
  } catch (error) {
    app.logger.error(error.message)
  }

  // Create default users if not already done
  const usersService = app.getService('users')
  if (usersService && authConfig) {
    const defaultUsers = authConfig.defaultUsers
    if (defaultUsers) {
      const users = await usersService.find({ paginate: false })
      defaultUsers.forEach(defaultUser => {
        const createdUser = users.find(user => user.email === defaultUser.email)
        if (!createdUser) {
          app.logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
          usersService.create({ email: defaultUser.email, password: defaultUser.password })
        }
      })
    }
  }
}
