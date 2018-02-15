const express = require('express')
const unhandledErrors = require('./unhandled-errors')
const middlewareLoad = require('./middleware-load')
const initDevelopment = require('./init-development')
const initProduction = require('./init-production')
const logMessages = require('./log-messages')

module.exports = (options = {}, databaseConnectedCb = () => {}) => {
  return new Promise(async (resolve, reject) => {
    unhandledErrors(options) // globally catch unhandled errors

    const app = express()
    const log = logMessages(options)
    const loadedMiddleware = await middlewareLoad(app, options)

    log.middleware.initialized(loadedMiddleware)

    if (options.isDev) {
      initDevelopment(app, options, dbConnection => {
        databaseConnectedCb(dbConnection)
      }).then(({ dbConnection, watcherInstance }) => {
        resolve({ app, watcher: watcherInstance, db: dbConnection })
      })
    } else {
      initProduction(app, options).then(({ dbConnection }) => {
        resolve({ app, db: dbConnection })
      })
    }
  })
}