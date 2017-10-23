const fastify = require('fastify')
const glob = require('glob')
const fileWatcher = require('./file-watcher')
const controllersEvents = require('./controllers-events')
const optionsBuilder = require('./options-builder')
const databaseConnection = require('./database-connection')
const logger = require('./logger')

let app
let watcher
let db

const connectToDb = options => {
  return new Promise((resolve, reject) => {
    const models = glob.sync(options.modelsGlob)

    if (models.length === 0) {
      resolve(null)
    } else {
      databaseConnection(options)
        .then(conn => resolve(conn))
        .catch(err => reject(err))
    }
  })
}

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise((resolve, reject) => {
      // TODO --config-file cli argument (null above)
      const options = optionsBuilder(configPath, customOptions)
      app = fastify(options)
      const events = controllersEvents(app, options)
      const log = logger(options.logger)

      if (options.dev) {
        // prevents warning message
        // TODO: still has a warnng message if starting mongod, sometimes
        process.setMaxListeners(Infinity)
        require('events').EventEmitter.prototype._maxListeners = Infinity
      }

      const connectDb = () => {
        connectToDb(options)
          .then(conn => {
            if (conn) {
              db = conn
              log.info(`Connected to database '${options.database.url}'`)
            } else {
              log.info('No models found, skip database connection')
            }

            resolve({ app, watcher, db })
          })
          .catch(err => reject(err))
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
            connectDb()
          })
        } else {
          connectDb()
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
