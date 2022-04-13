import path from 'path'
import { fileURLToPath } from 'url'
import logger from 'winston'
import core, { initializeElements } from '@weacast/core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelPath = path.join(__dirname, 'models')
const servicePath = path.join(__dirname, 'services')

export default async function () {
  const app = this
  const authConfig = app.get('authentication')
  // Setup app services
  try {
    // Healthcheck
    app.get(app.get('apiPath') + '/healthcheck', (req, res) => {
      res.set('Content-Type', 'application/json')
      return res.status(200).json({ isRunning: true })
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
          logger.error(error.message)
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
        logger.error(error.message)
      }
    }
  } catch (error) {
    logger.error(error.message)
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
          logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
          usersService.create({ email: defaultUser.email, password: defaultUser.password })
        }
      })
    }
  }
}
