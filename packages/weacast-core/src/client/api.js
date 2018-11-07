import logger from 'loglevel'
import feathers from 'feathers-client'
import hooks from 'feathers-hooks'
import io from 'socket.io-client'

export function weacast (config) {
  let api = feathers()
  // Setup log level
  if (config.logs && config.logs.level) {
    logger.setLevel(config.logs.level, false)
  } else {
    logger.setLevel('info')
  }
  api.configure(hooks())
  const origin = config.apiUrl || window.location.origin
  if (config.transport === 'http') {
    api.configure(feathers.rest(origin).fetch(window.fetch.bind(window)))
  } else {
    let socket = io(origin, {
      transports: ['websocket'],
      path: config.apiPath + 'ws'
    })
    api.configure(feathers.socketio(socket, { timeout: config.apiTimeout || 30000 }))
  }
  api.configure(feathers.authentication({
    storage: window.localStorage,
    cookie: 'weacast-jwt',
    storageKey: 'weacast-jwt',
    path: config.apiPath + '/authentication'
  }))

  // This avoid managing the API path before each service name
  api.getService = function (path) {
    return api.service(config.apiPath + '/' + path)
  }

  return api
}
