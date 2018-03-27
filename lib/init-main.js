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

    // TODO test me
    Object.keys(options.expressSettings).forEach(settingName => {
      app.set(settingName, options.expressSettings[settingName])
    })

    log.server.settings(options.expressSettings)

    if (options.isDev) {
      initDevelopment(app, options, dbConnection => {
        databaseConnectedCb(dbConnection)
      }).then(({ dbConnection, watcherInstance }) => {
        resolve({ app, watcher: watcherInstance, db: dbConnection })
      })
    } else {
      initProduction(app, options).then(instances => {
        resolve({ app, db: instances.dbConnection })
      })
    }
  })
}
