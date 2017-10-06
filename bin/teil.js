const { join } = require('path')
const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')

const app = fastify()

fileWatcher([
  {
    glob: join(process.cwd(), 'controllers/*.js'),
    cb (location) {
      controllersEvents[location.eventName](location, app)
    }
  }
])

/* fileWatcher([
  {
    glob: join(process.cwd(), 'controllers/*.js'),
    cb ({ eventName, filePath }) {
      // check if exists
      // switch on top
      console.log('controlles', eventName, filePath)
      controllerParser(filePath)
        .then(routes => {
          switch (eventName) {
            case 'add':
              routes.forEach(route => {
                fastify.route(route)
                console.log(`Loaded: ${route.method} ${route.url}`)
                // IDEA color routes, green if schemas are used, yellow if middleware is used, red when only a function is mapped (open to all)
              })
              break

            case 'change':
              for (let fastifyRoute of fastify) {
                const url = Object.keys(fastifyRoute)[0]
                const route = routes.find(r => r.url === url)

                if (route) {
                  fastifyRoute[url].get.handler = route.handler
                  fastifyRoute[url].get.preHandler = route.beforeHandler // TODO global handlers
                  fastifyRoute[url].get.schema = route.schema

                  console.log(`Reloaded: ${route.method} ${route.url}`)
                }
              }
              break

            default:
              console.log(`Unknown event '${eventName}'`)
          }
        })
        .catch(err => console.log('err', err))
    }
  }
]) */

app.listen(3003, function (err) {
  if (err) throw err
  console.log(`server listening on ${app.server.address().port}`)
})
