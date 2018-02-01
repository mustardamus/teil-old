const importFresh = require('import-fresh')
const { isArray, isFunction } = require('lodash')

module.exports = (middlewarePath, options = {}) => {
  return new Promise((resolve, reject) => {
    let middlewares = importFresh(middlewarePath)

    if (isFunction(middlewares)) {
      middlewares = [middlewares]
    } else if (!isArray(middlewares)) {
      const err = new Error(`Middleware '${middlewarePath}' must export a single function or an array of functions`)
      return reject(err)
    }

    middlewares = middlewares.map(middleware => {
      if (!isFunction(middleware)) {
        const err = new Error(`Middleware '${middlewarePath}' must export an array of functions`)
        reject(err)
      }

      if (middleware.length !== 3) {
        const err = new Error(`Middleware '${middlewarePath}' must have three arguments: 'req', 'res' and 'next'`)
        reject(err)
      }

      return middleware
    })

    resolve(middlewares)
  })
}
