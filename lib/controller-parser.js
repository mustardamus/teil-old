const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const { isObject, isFunction, isArray } = require('lodash')
const handlerWrapper = require('./handler-wrapper')
const { makeCleanUrl, isAllowedMethod } = require('./helpers')

module.exports = (controllerPath, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!existsSync(controllerPath)) {
      const err = new Error(`Controller '${controllerPath}' does not exist`)
      return reject(err)
    }

    const controller = importFresh(controllerPath)

    if (!isObject(controller)) {
      const err = new Error(`Controller '${controllerPath}' must export an Object`)
      return reject(err)
    }

    let resourceName = basename(controllerPath, '.js')
    const fullRoutes = Object.keys(controller)
    const retArr = fullRoutes.map(fullRoute => {
      const fullRouteSplit = fullRoute.split(' ')

      if (fullRouteSplit.length !== 2) {
        const err = new Error(`Invalid route definition '${fullRoute}' in controller ${controllerPath}`)
        return reject(err)
      }

      const method = fullRouteSplit[0].toUpperCase()

      if (!isAllowedMethod(method)) {
        const err = new Error(`Invalid method '${method}' in controller ${controllerPath}`)
        return reject(err)
      }

      const subRoute = makeCleanUrl(fullRouteSplit[1])
      const url = makeCleanUrl('/' + resourceName + subRoute)
      const routeObj = controller[fullRoute]
      let handler = null
      let middlewares = []
      let schema = {}

      if (isFunction(routeObj)) {
        handler = routeObj
      }

      if (isArray(routeObj)) {
        const lastFunc = routeObj.pop()

        if (isFunction(lastFunc)) {
          handler = lastFunc
        }

        if (isObject(routeObj[0])) {
          schema = routeObj[0]
        }

        middlewares = routeObj
          .filter(o => isFunction(o))
          .map(o => handlerWrapper(o, options))
      }

      if (handler === null) {
        const err = new Error(`No handler function found in '${fullRoute}' in controller ${controllerPath}`)
        return reject(err)
      } else {
        handler = handlerWrapper(handler, options)
      }

      return { method, url, handler, middlewares, schema }
    })

    resolve(retArr)
  })
}
