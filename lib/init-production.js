const glob = require('glob')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const logger = require('./logger')
const databaseConnection = require('./database-connection')

module.exports = (app, options = {}) => {
  const logInstance = logger(options)
  const ctrlEvents = controllersEvents(app, options)
  const modEvents = modelsEvents(app, options)
  const initModelsCount = glob.sync(options.modelsGlob).length

  const log = (category, msg, level = 'info') => {
    logInstance[level]('[teil]'.lightCyan + `[${category}]`.cyan, msg)
  }

  ctrlEvents.init()
  modEvents.init()

  if (initModelsCount === 0) {
    log('database', 'No models found, skip database connection')
    return Promise.resolve(null)
  }

  return databaseConnection(options)
    .then(dbConnection => {
      log('database', `Connected to ${options.database.url.yellow}`)
      return dbConnection
    })
    .catch(err => log('database', err, 'error'))
}
