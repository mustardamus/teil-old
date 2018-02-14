const glob = require('glob')
const controllersEvents = require('./controllers-events')
const modelsEvents = require('./models-events')
const logMessages = require('./log-messages')
const databaseConnection = require('./database-connection')

module.exports = (app, options = {}) => {
  const log = logMessages(options)
  const ctrlEvents = controllersEvents(app, options)
  const modEvents = modelsEvents(app, options)
  const initModelsCount = glob.sync(options.modelsGlob).length

  ctrlEvents.init()
  modEvents.init()

  // TODO init middleware

  if (initModelsCount === 0) {
    log.database.noModels()
    return Promise.resolve(null)
  }

  return databaseConnection(options)
    .then(dbConnection => {
      log.database.connected(options.database.url)
      return dbConnection
    })
    .catch(err => log.database.error(err))
}
