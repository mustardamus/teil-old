module.exports = (app, replaceRoute) => {
  let found = false

  for (const route of app) {
    const url = Object.keys(route)[0]
    const store = route[url][replaceRoute.method.toLowerCase()]

    if (replaceRoute.url === url && store) {
      store.handler = replaceRoute.handler
      store.preHandler = replaceRoute.beforeHandler // TODO global handlers
      store.schema = replaceRoute.schema
      found = true
    }
  }

  if (!found) {
    app.route(replaceRoute)
    return false // added
  } else {
    return true // replaces
  }
}
