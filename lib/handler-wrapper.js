const { isFunction } = require('lodash')
const contextBuilder = require('./context-builder')

let proxyNext

process.on('unhandledRejection', (err, promise) => {
  if (isFunction(proxyNext)) {
    // pass thrown errors of async functions to error handling middleware
    proxyNext(err)
  }
})

module.exports = (handler, schema, options = {}) => {
  const orgHandler = handler.bind({})

  return async (req, res, next) => {
    proxyNext = next

    try { // synchronous function handled with good ol try/catch
      // if there is an async error, it will be handled by the 'unhandledRejection' callback above

      if (orgHandler.length === 1) {
        const context = await contextBuilder({ req, res, next, schema }, options)
        orgHandler(context)
      } else {
        return orgHandler(req, res, next)
      }
    } catch (err) {
      next(err) // pass the catched error on to the error handling middleware
    }
  }
}
