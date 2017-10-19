const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')
const optionsBuilder = require('../lib/options-builder')
const databaseConnection = require('../lib/database-connection')

let app
let watcher
let db

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise((resolve, reject) => {
      // TODO --config-file cli argument (null above)
      const options = optionsBuilder(configPath, customOptions)
      app = fastify(options)
      const events = controllersEvents(app, options)

      if (options.dev) {
        require('events').EventEmitter.prototype._maxListeners = 1000
      }

      app.listen(options.port, err => {
        if (err) {
          return reject(err)
        }

        if (options.dev) {
          watcher = fileWatcher([
            {
              glob: options.controllersGlob,
              cb (location) {
                events[location.eventName](location)
              }
            }
          ])

          watcher.on('ready', () => {
            databaseConnection(options).then(conn => {
              db = conn
              resolve({ app, watcher, db })
            })
          })
        } else {
          databaseConnection(options).then(conn => {
            db = conn
            resolve({ app, db })
          })
        }
      })
    })
  },

  stop () {
    app.close()
    watcher.close()
    db.close()
  }
}
