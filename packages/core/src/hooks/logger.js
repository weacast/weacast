// A hook that logs service method before, after and error
export function log (hook) {
  let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`

  if (hook.type === 'error') {
    message += `: ${hook.error.message}`
  }

  if (hook.error) {
    hook.app.logger.error(message, hook.error.stack)
  } else {
    hook.app.logger.debug(message)
  }

  // Required as the logger causes high CPU usage to serialize messages
  // even if the current log level should discard it
  // See https://github.com/kalisio/kdk/issues/287
  if (process.env.NODE_ENV === 'development') {
    hook.app.logger.silly('hook.data', hook.data)
    hook.app.logger.silly('hook.params', hook.params)

    if (hook.result) {
      hook.app.logger.silly('hook.result', hook.result)
    }
  }
}
