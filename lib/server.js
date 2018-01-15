const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const fileWatcher = require('./file-watcher')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const optionsBuilder = require('./options-builder')
const databaseConnection = require('./database-connection')
const logger = require('./logger')
const useMiddlewares = require('./use-middlewares')
const { makeCleanUrl } = require('./helpers')
// const useHooks = require('./use-hooks')

let app, server, watcher, db

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
      const logInstance = logger(options)
      const initModelCount = glob.sync(options.modelsGlob).length
      const log = (category, msg) => {
        logInstance.info('[teil]'.lightCyan + `[${category}]`.cyan + ' ' + msg)
      }

      if (options.dev) {
        // prevents warning message
        // TODO: still has a warning message if starting mongod, sometimes, mostly in tests
        // probably because it takes some time before mongod quits (if its started via start-mongod)
        // this maybe comming from the request package in the tests?
        process.setMaxListeners(Infinity)
        require('events').EventEmitter.prototype._maxListeners = Infinity
      }

      const connectDb = () => {
        connectToDb(options)
          .then(conn => {
            if (conn) {
              db = conn
              log('database', `Connected to ${options.database.url.yellow}`)
            } else {
              log('database', 'No models found, skip connection')
            }

            resolve({ app, watcher, db })
          })
          .catch(err => reject(err))
      }

      server = app.listen(options.port, err => {
        if (err) {
          return reject(err)
        }

        log('server', `Listening to ${`http://localhost:${options.port}`.yellow}`)

        const middlewares = useMiddlewares(app, options).map(m => m.yellow)

        app.use(express.json())
        log('server', `Use middlewares ${middlewares.join(', ')}`)

        /* const hooks = useHooks(app, options).map(h => {
          if (h.name.length === 0) {
            return yellow(h.hookName)
          } else {
            return yellow(`${h.name} (${h.hookName})`)
          }
        })

        log.info(`Used Hooks: ${hooks.join(', ')}`) */

        if (existsSync(options.staticPath)) { // TODO have a watcher for the static path, if added use middleware
          const staticEndpoint = makeCleanUrl(options.staticEndpoint)

          app.use(staticEndpoint, express.static(options.staticPath))
          log('server', `Serve static files from ${options.staticPath.yellow} at ${staticEndpoint.green}`)
        }

        if (options.dev) {
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
                        log('database', `Connected to ${options.database.url.yellow}`)
                      }
                    })
                    .catch(err => log.error(err))
                }

                modEvents[location.eventName](location)
              }
            }
          ])

          watcher.on('ready', () => {
            log('dev', `Watching files at ${options.controllersGlob.yellow}`)
            log('dev', `Watching files at ${options.modelsGlob.yellow}`)

            ctrlEvents.init()
            modEvents.init()
            connectDb()
          })
        } else {
          ctrlEvents.init()
          modEvents.init()
          connectDb()
        }
      })
    })
  },

  stop () {
    if (server.close) {
      server.close()
    }

    if (watcher.close) {
      watcher.close()
    }

    if (db.close) {
      db.close()
    }
  }
}
