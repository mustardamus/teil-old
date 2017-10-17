const pino = require('pino')

module.exports = (options = {}) => {
  if (!options.logger) {
    options.logger = {
      level: 'silent'
    }
  }

  if (!options.logger.level) {
    options.logger.level = 'silent'
  }

  const log = pino(options.logger)

  return log
}
