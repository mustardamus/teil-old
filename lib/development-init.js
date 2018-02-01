const glob = require('glob')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const fileWatcher = require('./file-watcher')
const logger = require('./logger')
const databaseConnection = require('./database-connection')
const { removeCwd } = require('./helpers')

module.exports = (app, options = {}, databaseConnectedCb = () => {}) => {
  return new Promise((resolve, reject) => {
    const logInstance = logger(options)
    const ctrlEvents = controllersEvents(app, options)
    const modEvents = modelsEvents(app, options)
    let initModelCount = glob.sync(options.modelsGlob).length

    const log = (category, msg, level = 'info') => {
      logInstance[level]('[teil]'.lightCyan + `[${category}]`.cyan, msg)
    }

    const connectToDb = () => {
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
          if (location.eventName === 'add' && initModelCount === 0) {
            connectToDb()
            initModelCount++
          }

          modEvents[location.eventName](location)
        }
      }
    ])

    watcherInstance.on('ready', () => {
      const controllersGlob = removeCwd(options.controllersGlob)
      const modelsGlob = removeCwd(options.modelsGlob)

      log('dev', `Watching files at ${controllersGlob.yellow}`)
      log('dev', `Watching files at ${modelsGlob.yellow}`)

      if (initModelCount === 0) {
        log('database', 'No models found, skip database connection')
      }

      ctrlEvents.init()
      modEvents.init()

      connectToDb().then(dbConnection => {
        resolve({ dbConnection, watcherInstance })
      })
    })
  })
}
