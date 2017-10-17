const controllerParser = require('./controller-parser')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const log = logger(options.logger)

  return {
    add (location) {
      controllerParser(location.filePath, options)
        .then(routes => {
          routes.forEach(route => {
            app.route(route)
            log.info(`Add: ${route.method} ${route.url}`)
          })
        })
        .catch(err => console.log(err))
    },

    change (location) {
      controllerParser(location.filePath, options)
        .then(routes => {
          routes.forEach(route => {
            let found = false

            for (const fastifyRoute of app) {
              const url = Object.keys(fastifyRoute)[0]
              const store = fastifyRoute[url][route.method.toLowerCase()]

              if (route.url === url && store) {
                store.handler = route.handler
                store.preHandler = route.beforeHandler // TODO global handlers
                store.schema = route.schema
                found = true

                log.info(`Updated: ${route.method} ${route.url}`)
              }
            }

            if (!found) {
              app.route(route)
              log.info(`Add: ${route.method} ${route.url}`)
            }
          })
        })
        .catch(err => console.log(err))
    },

    unlink (location) {
      // set handler to function that returns 404
      // clear preHandler
    }
  }
}
