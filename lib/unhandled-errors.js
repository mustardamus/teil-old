const { join, basename } = require('path')
const StackTracey = require('stacktracey')
const anymatch = require('anymatch')
const logger = require('./logger')
const { makeCleanUrl } = require('./helpers')

module.exports = (options = {}) => {
  const log = logger(options)
  const prefix = '[teil]'.lightCyan + `[error]`.cyan
  const cwd = process.cwd()

  process.on('unhandledRejection', err => {
    const stack = new StackTracey(err)
    const fileFull = join(cwd, stack[0].fileRelative)

    if (anymatch(options.controllersGlob, fileFull)) {
      // if the error originated in a controller, it is likely it wasnt catched
      // because the route handler does not return a promise
      const [method, path] = stack[0].callee.split(' ')
      const url = makeCleanUrl(path.split('.')[0])
      const apiEndpoint = makeCleanUrl(options.apiEndpoint)
      const resourceName = basename(stack[0].fileRelative, '.js')
      const fullUrl = `${apiEndpoint}/${resourceName}${url}`.green

      log.error(prefix, ' UNHANDLED ERROR '.bgLightRed.black, method.lightYellow, fullUrl, '->', err.message.lightRed)
      log.error(prefix, ' SOLUTION '.bgLightGreen.black, 'Async routes must return a Promise'.lightGreen)
    } else {
      log.error(prefix, ' UNHANDLED ERROR '.bgLightRed.black, err.message.lightRed)
    }

    log.error(prefix, err)
  })
}
