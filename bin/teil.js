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

app.listen(3003, function (err) {
  if (err) throw err
  console.log(`server listening on ${app.server.address().port}`)
})
