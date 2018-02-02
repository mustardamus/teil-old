const { existsSync } = require('fs')
const glob = require('glob')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const fileWatcher = require('./file-watcher')
const logger = require('./logger')
const databaseConnection = require('./database-connection')
const { removeCwd } = require('./helpers')
const serveStatic = require('./serve-static')
const middlewareReload = require('./middleware-reload')

module.exports = (app, server, options = {}, databaseConnectedCb = () => {}) => {
  return new Promise((resolve, reject) => {
    const logInstance = logger(options)
    const ctrlEvents = controllersEvents(app, options)
    const modEvents = modelsEvents(app, options)
    const initModelsCount = glob.sync(options.modelsGlob).length
    let initStaticPathExists = existsSync(options.staticPath)

    const log = (category, msg, level = 'info') => {
      logInstance[level]('[teil]'.lightCyan + `[${category}]`.cyan, msg)
    }

    const connectToDb = () => {
      const modelsCount = glob.sync(options.modelsGlob).length

      if (modelsCount === 0) {
        log('database', 'No models found, skip database connection')
        return Promise.resolve(null)
      }

      return databaseConnection(options)
        .then(dbConnection => {
          databaseConnectedCb(dbConnection)
          log('database', `Connected to ${options.database.url.yellow}`)
          return dbConnection
        })
        .catch(err => log('database', err, 'error'))
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
          }
        }
      },
      {
        glob: options.middlewaresGlob,
        cb (location) {
          middlewareReload(app, options)
        }
      }
    ])

    watcherInstance.once('ready', () => {
      const controllersGlob = removeCwd(options.controllersGlob)
      const modelsGlob = removeCwd(options.modelsGlob)

      log('dev', `Watching files at ${controllersGlob.yellow}`)
      log('dev', `Watching files at ${modelsGlob.yellow}`)

      ctrlEvents.init()
      modEvents.init()

      connectToDb().then(dbConnection => {
        resolve({ dbConnection, watcherInstance })
      })
    })
  })
}
