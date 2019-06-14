const logger = require('winston')

module.exports = function () {
  // Add your custom code here.
  const app = this

  logger.verbose('No custom plugin loaded')
}
