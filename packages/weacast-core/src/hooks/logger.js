// A hook that logs service method before, after and error
const logger = require('winston')

export function log (hook) {
  let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`

  if (hook.type === 'error') {
    message += `: ${hook.error.message}`
  }

  if (hook.error) {
    logger.error(message)
  } else {
    logger.verbose(message)
  }

  logger.debug('hook.data', hook.data)
  logger.debug('hook.params', hook.params)

  if (hook.result) {
    logger.debug('hook.result', hook.result)
  }
}
