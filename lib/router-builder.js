const express = require('express')
const glob = require('glob')
const controllerParser = require('./controller-parser')
const middlewareValidateData = require('./middleware-validate-data')
const middlewareErrorHandling = require('./middleware-error-handling')

module.exports = (options = {}) => {
  return new Promise(async (resolve, reject) => {
    const router = express.Router()
    const controllerPaths = glob.sync(options.controllersGlob)

    await controllerPaths.forEach(async controllerPath => {
      controllerParser(controllerPath, options)
        .then(async controller => {
          await controller.forEach(route => {
            const routerFunc = router[route.method.toLowerCase()]
            const handlers = [
              middlewareValidateData(route, options),
              ...route.middlewares,
              route.handler,
              middlewareErrorHandling(options)
            ]

            routerFunc.apply(router, [route.url, ...handlers])
          })
        })
        .catch(() => {
          // errors are handled in controller-events.js
          // this is only here to prevent the unhandled rejection warning
        })
    })

    resolve(router)
  })
}
