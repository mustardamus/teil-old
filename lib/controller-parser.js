const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const handlerWrapper = require('./handler-wrapper')
const { makeCleanUrl, isAllowedMethod } = require('./helpers')

module.exports = controllerPath => {
  return new Promise((resolve, reject) => {
    if (!existsSync(controllerPath)) {
      const err = new Error(`Controller '${controllerPath}' does not exist`)
      return reject(err)
    }

    const controller = importFresh(controllerPath)
    const resourceName = basename(controllerPath, '.js')

    if (controller !== Object(controller)) {
      const err = new Error(`Controller '${controllerPath}' must export an Object`)
      return reject(err)
    }

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

      const url = makeCleanUrl(`/${resourceName}/${fullRouteSplit[1]}`)
      const routeObj = controller[fullRoute]
      let handler = null
      let beforeHandler = []
      let schema = {}

      if (typeof routeObj === 'function') {
        handler = routeObj
      }

      if (Array.isArray(routeObj)) {
        const lastFunc = routeObj.pop()

        if (typeof lastFunc === 'function') {
          handler = lastFunc
        }

        if (routeObj[0] === Object(routeObj[0])) {
          schema = routeObj[0]
        }

        beforeHandler = routeObj
          .filter(o => typeof o === 'function')
          .map(o => handlerWrapper(o))
      }

      if (handler === null) {
        const err = new Error(`No handler function found in '${fullRoute}' in controller ${controllerPath}`)
        return reject(err)
      } else {
        handler = handlerWrapper(handler)
      }

      return { method, url, handler, beforeHandler, schema }
    })

    resolve(retArr)
  })
}
