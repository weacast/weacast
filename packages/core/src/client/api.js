import logger from 'loglevel'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'

export function weacast (config) {
  const api = feathers()
  // Setup log level
  if (config.logs && config.logs.level) {
    logger.setLevel(config.logs.level, false)
  } else {
    logger.setLevel('info')
  }
  const origin = config.apiUrl || window.location.origin
  if (config.transport === 'http') {
    api.configure(feathers.rest(origin).fetch(window.fetch.bind(window)))
  } else {
    const socket = io(origin, {
      transports: ['websocket'],
      path: config.apiPath + 'ws'
    })
    api.configure(feathers.socketio(socket, { timeout: config.apiTimeout || 30000 }))
  }
  api.configure(feathers.authentication({
    storage: config.storage || window.localStorage,
    cookie: config.apiJwt || 'weacast-jwt',
    storageKey: config.apiJwt || 'weacast-jwt',
    path: config.apiPath + '/authentication'
  }))

  // This avoid managing the API path before each service name
  api.getService = function (path) {
    return api.service(config.apiPath + '/' + path)
  }
  // Simple interface to manage current forecast time
  api.setForecastTime = function (time) {
    api.forecastTime = time
    api.emit('forecast-time-changed', time)
  }
  api.getForecastTime = function () {
    return api.forecastTime
  }

  return api
}
