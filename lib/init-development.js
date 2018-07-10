const { existsSync } = require('fs')
const glob = require('glob')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const fileWatcher = require('./file-watcher')
const logMessages = require('./log-messages')
const databaseConnection = require('./database-connection')
const serveStatic = require('./serve-static')
const middlewareReload = require('./middleware-reload')

module.exports = (app, options = {}, databaseConnectedCb = () => {}) => {
  return new Promise((resolve, reject) => {
    const log = logMessages(options)
    const ctrlEvents = controllersEvents(app, options)
    const modEvents = modelsEvents(app, options)
    const initModelsCount = glob.sync(options.modelsGlob).length
    let initStaticPathExists = existsSync(options.staticPath)

    const connectToDb = () => {
      const modelsCount = glob.sync(options.modelsGlob).length

      if (modelsCount === 0) {
        log.database.noModels()
        return Promise.resolve(null)
      }

      return databaseConnection(options)
        .then(dbConnection => {
          databaseConnectedCb(dbConnection)
          log.database.connected(options.database.url)
          return dbConnection
        })
        .catch(err => log.database.error(err))
    }

    const watcherInstance = fileWatcher([
      {
        glob: options.controllersGlob,
        cb (location) {
          ctrlEvents[location.eventName](location)
        }
      },
      {
        glob: options.modelsGlob,
        cb (location) {
          if (location.eventName === 'add' && initModelsCount === 0) {
            connectToDb()
          }

          modEvents[location.eventName](location)
        }
      },
      {
        glob: `${options.staticPath}/**/*`,
        cb ({ eventName }) {
          if (eventName === 'add' && !initStaticPathExists) {
            initStaticPathExists = true

            serveStatic(app, options)
            log.static.serving(options.staticPath, options.staticOptions)
          }
        }
      },
      {
        glob: options.middlewaresGlobalGlob,
        cb: async (location) => {
          const loaded = await middlewareReload(app, options)
          log.middleware.updated(loaded)
        }
      }
    ])

    if (initStaticPathExists) {
      log.static.serving(options.staticPath, options.staticEndpoint)
    } else {
      log.static.notFound()
    }

    // watcherInstance.once('ready', () => {
    // this does not fire on linux

    log.dev.watchFiles(options.controllersGlob)
    log.dev.watchFiles(options.modelsGlob)

    ctrlEvents.init()
    modEvents.init()

    connectToDb().then(dbConnection => {
      resolve({ dbConnection, watcherInstance })
    })
  })
}
