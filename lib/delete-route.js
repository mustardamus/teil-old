const replaceRoute = require('./replace-route')

module.exports = (app, resourceName) => {
  for (const fastifyRoute of app) {
    const url = Object.keys(fastifyRoute)[0]
    const store = fastifyRoute[url]

    if (url.substr(1, resourceName.length) === resourceName.toLowerCase()) {
      Object.keys(store).forEach(method => {
        // TODO maybe pass an object in the controller parser and replace with
        // the generated route object instead of this, because this only works in one direction
        // you cant re-add a controller

        const fof = {
          method,
          url,
          beforeHandler: [],
          schema: {},
          handler (request, reply) {
            reply.code(404).send()
          }
        }

        replaceRoute(app, fof)
      })
    }
  }
}
