const replaceRoute = require('./replace-route')

module.exports = (app, resourceName) => {
  for (const fastifyRoute of app) {
    const url = Object.keys(fastifyRoute)[0]
    const store = fastifyRoute[url]

    if (url.substr(1, resourceName.length) === resourceName.toLowerCase()) {
      Object.keys(store).forEach(method => {
        replaceRoute(app, {
          method,
          url,
          beforeHandler: [],
          schema: {},
          handler (request, reply) {
            reply.code(404).send()
          }
        })
      })
    }
  }
}
