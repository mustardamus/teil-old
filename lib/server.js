const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')
const optionsBuilder = require('../lib/options-builder')
const databaseConnection = require('../lib/database-connection')
const logger = require('../lib/logger')

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
      const log = logger(options.logger)

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
            },
            {
              glob: options.modelsGlob,
              cb (location) {
                log.info(`${location.eventName}: ${location.filePath}`)
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
