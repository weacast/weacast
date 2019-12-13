import path from 'path'
import logger from 'winston'
import core, { initializeElements } from 'weacast-core'

const modelPath = path.join(__dirname, 'models')
const servicePath = path.join(__dirname, 'services')

module.exports = async function () {
  const app = this
  const authConfig = app.get('authentication')
  // Setup app services
  try {
    // Healthcheck
    app.get(app.get('apiPath') + '/healthcheck', (req, res) => {
      res.set('Content-Type', 'application/json')
      return res.status(200).json({ isRunning: true })
    })
    if (authConfig) app.createService('users', modelPath, servicePath)
    app.configure(core)
    // Setup if we use local loaders
    const loaders = app.get('loaders')
    if (loaders && loaders.length > 0) {
      // Iterate over configured loaders
      for (let i = 0; i < loaders.length; i++) {
        // Setup loader plugins by dynamically require them
        try {
          const plugin = require(`weacast-${loaders[i]}`)
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
        const plugin = require(`weacast-${plugins[i]}`)
        await app.configure(plugin)
      } catch (error) {
        logger.error(error.message)
      }
    }
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
}
