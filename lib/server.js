const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const { yellow } = require('chalk')
const fileWatcher = require('./file-watcher')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const optionsBuilder = require('./options-builder')
const databaseConnection = require('./database-connection')
const logger = require('./logger')
const useMiddlewares = require('./use-middlewares')
// const useHooks = require('./use-hooks')

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
      const options = optionsBuilder(configPath, customOptions)
      app = express()
      const ctrlEvents = controllersEvents(app, options)
      const modEvents = modelsEvents(app, options)
      const log = logger(options)
      const initModelCount = glob.sync(options.modelsGlob).length

      if (options.dev) {
        // prevents warning message
        // TODO: still has a warning message if starting mongod, sometimes, mostly in tests
        // probably because it takes some time before mongod quits (if its started via start-mongod)
        process.setMaxListeners(Infinity)
        require('events').EventEmitter.prototype._maxListeners = Infinity
      }

      const connectDb = () => {
        connectToDb(options)
          .then(conn => {
            if (conn) {
              db = conn
              log.info(`Connected to database '${yellow(options.database.url)}'`)
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

        log.info(`Server listening: ${yellow(`http://localhost:${options.port}`)}`)

        const middlewares = useMiddlewares(app, options).map(m => yellow(m))

        log.info(`Used Middlewares: ${middlewares.join(', ')}`)
        app.use(express.json())

        /* const hooks = useHooks(app, options).map(h => {
          if (h.name.length === 0) {
            return yellow(h.hookName)
          } else {
            return yellow(`${h.name} (${h.hookName})`)
          }
        })

        log.info(`Used Hooks: ${hooks.join(', ')}`) */

        if (existsSync(options.staticPath)) { // TODO have a watcher for the static path, if added use middleware
          app.use('/', express.static(options.staticPath))
          log.info(`Static files: ${yellow(options.staticPath)}`)
        }

        if (options.dev) {
          ctrlEvents.init()
          modEvents.init()

          watcher = fileWatcher([
            {
              glob: options.controllersGlob,
              cb (location) {
                ctrlEvents[location.eventName](location)
              }
            },
            {
              glob: options.modelsGlob,
              cb (location) {
                if (location.eventName === 'add' && initModelCount === 0) {
                  connectToDb(options)
                    .then(conn => {
                      if (conn) {
                        db = conn
                        log.info(`Connected to database '${yellow(options.database.url)}'`)
                      }
                    })
                    .catch(err => log.error(err))
                }

                modEvents[location.eventName](location)
              }
            }
          ])

          watcher.on('ready', () => {
            log.info(`Watching files: ${yellow(options.controllersGlob)}`)
            log.info(`Watching files: ${yellow(options.modelsGlob)}`)
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

    if (watcher.close) {
      watcher.close()
    }

    if (db.close) {
      db.close()
    }
  }
}
