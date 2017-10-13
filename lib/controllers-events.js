const controllerParser = require('../lib/controller-parser')

module.exports = {
  add ({ location, app, options }) {
    controllerParser(location.filePath, options)
      .then(routes => {
        routes.forEach(route => {
          app.route(route)
          console.log(`Add: ${route.method} ${route.url}`)
        })
      })
      .catch(err => console.log(err))
  },

  change ({ location, app, options }) {
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

              console.log(`Updated: ${route.method} ${route.url}`)
            }
          }

          if (!found) {
            app.route(route)
            console.log(`Add: ${route.method} ${route.url}`)
          }
        })
      })
      .catch(err => console.log(err))
  },

  unlink ({ location, app, options }) {
    // set handler to function that returns 404
    // clear preHandler
  }
}
