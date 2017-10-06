const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const handlerWrapper = require('./handler-wrapper')

const methodsAllowed = [
  'DELETE', 'GET', 'HEAD', 'PATCH',
  'POST', 'PUT', 'OPTIONS'
]

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

      if (!methodsAllowed.includes(method)) {
        const err = new Error(`Invalid method '${method}' in controller ${controllerPath}`)
        return reject(err)
      }

      // TODO helper function
      let url = fullRouteSplit[1]

      if (url.charAt(0) === '/') {
        url = url.substr(1, url.length - 1)
      }

      url = `/${resourceName}/${url}`

      if (url.charAt(url.length - 1) === '/') {
        url = url.substr(0, url.length - 1)
      }

      const routeObj = controller[fullRoute]
      let handler = null
      let beforeHandler = []
      let schema = {}

      if (typeof routeObj === 'function') {
        handler = routeObj
      }

      if (Array.isArray(routeObj)) {
        handler = routeObj.pop()
        beforeHandler = routeObj
          .filter(o => typeof o === 'function')
          .map(o => handlerWrapper(o))

        if (routeObj[0] === Object(routeObj[0])) {
          schema = routeObj[0]
        }
      }

      if (handler === null) {
        const err = new Error(`No hanlder function found in '${fullRoute}' in controller ${controllerPath}`)
        return reject(err)
      } else {
        handler = handlerWrapper(handler)
      }

      return { method, url, handler, beforeHandler, schema }
    })

    resolve(retArr)
  })
}
