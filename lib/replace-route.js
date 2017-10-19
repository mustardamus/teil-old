module.exports = (app, replaceRoute) => {
  return new Promise((resolve, reject) => {
    // reject(err)

    let found = false

    for (const route of app) {
      const url = Object.keys(route)[0]
      const store = route[url][replaceRoute.method.toLowerCase()]
      const replacedRoutes = []

      if (replaceRoute.url === url && store) {
        store.handler = replaceRoute.handler
        store.preHandler = replaceRoute.beforeHandler // TODO global handlers
        store.schema = replaceRoute.schema
        found = true
        replacedRoutes.push(route)
        // log.info(`Updated: ${route.method} ${route.url}`)
      }
    }

    if (found) {
      app.route(replaceRoute)
      resolve({ event: 'update', route: replaceRoute })
      // log.info(`Add: ${route.method} ${route.url}`)
    } else {
      resolve({ event: 'add', route: replaceRoute })
    }
  })
}
