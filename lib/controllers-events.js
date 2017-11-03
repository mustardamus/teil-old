const { basename } = require('path')
const controllerParser = require('./controller-parser')
const replaceRoute = require('./replace-route')
const deleteRoute = require('./delete-route')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const log = logger(options)

  return {
    add (location) {
      controllerParser(location.filePath, options)
        .then(routes => {
          routes.forEach(route => replaceRoute(app, route, options))

          let resourceName = routes[0].url.split('/')[1]
          const subRoutes = routes.map(route => {
            return `${route.method} ${route.url}`
          })

          if (resourceName.length === 0) {
            resourceName = 'index'
          }

          log.info(`Add Controller: ${resourceName} ( ${subRoutes.join(' | ')} )`)
        })
        .catch(err => log.error(err))
    },

    change (location) {
      controllerParser(location.filePath, options)
        .then(routes => {
          routes.forEach(route => {
            const replaced = replaceRoute(app, route, options)

            if (replaced) {
              log.info(`Updated Route: ${route.method} ${route.url}`)
            } else {
              log.info(`Added Route: ${route.method} ${route.url}`)
            }
          })
        })
        .catch(err => log.error(err))
    },

    unlink (location) {
      const resourceName = basename(location.filePath, '.js').toLowerCase()

      deleteRoute(app, resourceName)
      log.info(`Removed Routes: /${resourceName}/...`)
    }
  }
}
