const pino = require('pino')

module.exports = (options = {}) => {
  const pretty = pino.pretty()
  const log = pino(options.logger, pretty)

  pretty.pipe(process.stdout)
  return log
}
