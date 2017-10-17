const pino = require('pino')

module.exports = (options = {}) => {
  const log = pino(options)

  return log
}
