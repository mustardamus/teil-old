const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')

const app = fastify()
let watcher

const options = require('../example/teil.config')

module.exports = {
  start (port = 3003) {
    return new Promise((resolve, reject) => {
      app.listen(port, function (err) {
        if (err) {
          return reject(err)
        }

        watcher = fileWatcher([
          {
            glob: options.controllersGlob, // join(process.cwd(), 'controllers/*.js'),
            cb (location) {
              controllersEvents[location.eventName](location, app)
            }
          }
        ])

        watcher.on('ready', () => {
          resolve(app)
        })
      })
    })
  },

  stop () {
    app.close()
    watcher.close()
  }
}
