const StackTracey = require('stacktracey')
const logger = require('./logger')

module.exports = (options = {}) => {
  const log = logger(options)
  const render = log.error.before('render')
  const prefix = '[teil]'.lightCyan + `[error]`.cyan

  return (err, req, res, next) => {
    if (!err) {
      return next()
    }

    const { method, route } = req
    const prettyStack = new StackTracey(err).pretty
    const errorMsg = render(`${prefix} ${method.lightYellow} ${route.path.green} -> ${err.message.lightRed}\n${prettyStack.red}`)

    if (!res.headersSent) {
      res.status(500).send(err.message)
    }

    next('ERR! '.lightRed + errorMsg) // express will print the formatted error message
  }
}
