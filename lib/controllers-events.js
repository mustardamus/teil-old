const controllerParser = require('./controller-parser')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const log = logger(options)

  return {
    add (location) {
      controllerParser(location.filePath, options)
        .then(routes => {
          routes.forEach(route => app.route(route))

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
        .catch(err => log.error(err))
    },

    unlink (location) {
      // function um handler zu ersetzen
      // oben vereinfachen
      // hier die preHandler zurück setzen

      log.info(location)

      // check if url has location in its part (or name set in controller)
      // extract from filename

      /* for (const fastifyRoute of app) {
        const url = Object.keys(fastifyRoute)[0]
        const store = fastifyRoute[url][route.method.toLowerCase()]

        if (route.url === url && store) {
          store.handler = route.handler
          store.preHandler = route.beforeHandler // TODO global handlers
          store.schema = route.schema
          found = true

          log.info(`Deleted: ${route.method} ${route.url}`)
        }
      } */
    }
  }
}
