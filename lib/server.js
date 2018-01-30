const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const { isFunction } = require('lodash')
const unhandledErrors = require('./unhandled-errors')
const fileWatcher = require('./file-watcher')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const optionsBuilder = require('./options-builder')
const databaseConnection = require('./database-connection')
const logger = require('./logger')
const useMiddlewares = require('./use-middlewares')
const { makeCleanUrl, removeCwd } = require('./helpers')
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

      const connectDb = () => {
        connectToDb(options)
          .then(conn => {
            if (conn) {
              db = conn
              log('database', `Connected to ${options.database.url.yellow}`)
            } else {
              log('database', 'No models found, skip connection')
            }

            resolve({ app, server, watcher, db })
          })
          .catch(err => reject(err))
      }

      unhandledErrors(options) // globally catch unhandled errors

      server = app.listen(options.port, err => {
        if (err) {
          return reject(err)
        }

        app.use(express.json()) // TODO custom options passing

        const hasStaticPath = existsSync(options.staticPath)
        const middlewares = [
          'express.json'.lightYellow,
          ...useMiddlewares(app, options).map(m => m.green)
        ]

        log('server', `Listening to ${`http://localhost:${options.port}`.yellow}`)

        if (hasStaticPath) { // TODO have a watcher for the static path, if added use middleware
          const staticPath = removeCwd(options.staticPath)
          const staticEndpoint = makeCleanUrl(options.staticEndpoint)

          app.use(staticEndpoint, express.static(options.staticPath)) // TODO custom options passing
          middlewares.unshift('express.static'.lightYellow)
          log('server', `Serve static files from ${staticPath.yellow} at ${staticEndpoint.green}`)
        }

        log('server', `Use middlewares ${middlewares.join(' -> ')}`)

        /* const hooks = useHooks(app, options).map(h => {
          if (h.name.length === 0) {
            return yellow(h.hookName)
          } else {
            return yellow(`${h.name} (${h.hookName})`)
          }
        })

        log.info(`Used Hooks: ${hooks.join(', ')}`) */

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
            const controllersGlob = removeCwd(options.controllersGlob)
            const modelsGlob = removeCwd(options.modelsGlob)

            log('dev', `Watching files at ${controllersGlob.yellow}`)
            log('dev', `Watching files at ${modelsGlob.yellow}`)

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
    if (isFunction(server.close)) {
      server.close()
    }

    if (isFunction(watcher.close)) {
      watcher.close()
    }

    if (isFunction(db.close)) {
      db.close()
    }
  }
}
