import fs from 'fs-extra'
import https from 'https'
import path from 'path'
import proxyMiddleware from 'http-proxy-middleware'
import express from '@feathersjs/express'
import middlewares from './middlewares'
import services from './services'
import hooks from './hooks'
import channels from './channels'
import logger from 'winston'
import { weacast } from 'weacast-core'
import distribution from '@kalisio/feathers-distributed'

export class Server {
  constructor () {
    this.app = weacast()
    let app = this.app

    // Distribute services
    const distConfig = app.get('distribution')
    if (distConfig) app.configure(distribution(distConfig))

    // Serve pure static assets if any
    const staticPath = app.get('staticPath')
    if (staticPath && fs.pathExistsSync(staticPath)) {
      app.use('/', express.static(staticPath))
    }

    // Define HTTP proxies to your custom API backend. See /config/index.js -> proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    const proxyTable = app.get('proxyTable') || {}
    Object.keys(proxyTable).forEach(context => {
      let options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })
  }

  async run () {
    let app = this.app
    // First try to connect to DB
    await app.db.connect()
    // Set up our services
    await app.configure(services)
    // Register hooks
    app.hooks(hooks)
    // Set up real-time event channels
    app.configure(channels)
    // Configure middlewares - always has to be last
    app.configure(middlewares)
    // Custom configuration entry point if any
    const pluginPath = app.get('pluginPath')
    if (fs.pathExistsSync(pluginPath)) {
      const plugin = require(pluginPath)
      await app.configure(plugin)
    }

    // Last lauch server
    const httpsConfig = app.get('https')
    if (httpsConfig) {
      const port = httpsConfig.port
      let server = https.createServer({
        key: fs.readFileSync(httpsConfig.key),
        cert: fs.readFileSync(httpsConfig.cert)
      }, app)
      logger.info('Configuring HTTPS server at port ' + port.toString())
      await server.listen(port)
    } else {
      const port = app.get('port')
      logger.info('Configuring HTTP server at port ' + port.toString())
      await app.listen(port)
    }
  }
}
