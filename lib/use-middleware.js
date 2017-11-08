const { basename } = require('path')
const glob = require('glob')
const importFresh = require('import-fresh')
const { isArray, isFunction } = require('lodash')

module.exports = (app, options = {}) => {
  const middlewaresPaths = glob.sync(options.middlewaresGlob)
  const middlewaresNames = middlewaresPaths.map(m => basename(m, '.js'))

  middlewaresPaths.forEach(middlewarePath => {
    let middlewares = importFresh(middlewarePath)

    if (isFunction(middlewares)) {
      middlewares = [middlewares]
    } else if (!isArray(middlewares)) {
      throw new Error(`Middleware '${middlewarePath}' must export a single function or an array of functions`)
    }

    middlewares.forEach(middleware => {
      if (middleware.length === 3) {
        app.use(middleware)
      } else {
        throw new Error(`Middleware '${middlewarePath}' must have three arguments: 'req', 'res' and 'next'`)
      }
    })
  })

  return middlewaresNames
}
