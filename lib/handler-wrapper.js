const { isFunction } = require('lodash')
const contextBuilder = require('./context-builder')

module.exports = (handler, schema, options = {}) => {
  const orgHandler = handler.bind({})

  return async (req, res, next) => {
    let handler

    try { // synchronous function errors handled with good ol try/catch
      if (orgHandler.length === 1) {
        const context = await contextBuilder({ req, res, next, schema }, options)
        handler = orgHandler(context)
      } else {
        handler = orgHandler(req, res, next)
      }

      if (handler && isFunction(handler.catch)) { // if the handler returned a promise
        return handler.catch(err => next(err)) // catch any error and forward it to the error handling middleware
      } else {
        return handler
      }
    } catch (err) {
      next(err) // pass the catched error on to the error handling middleware
    }
  }
}
