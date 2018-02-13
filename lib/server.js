const express = require('express')
const { isFunction } = require('lodash')
const unhandledErrors = require('./unhandled-errors')
const optionsBuilder = require('./options-builder')
const logMessages = require('./log-messages')
const middlewareLoad = require('./middleware-load')
const initDevelopment = require('./init-development')
const initProduction = require('./init-production')

let app, server, watcher, db

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise((resolve, reject) => {
      const options = optionsBuilder(configPath, customOptions)

      unhandledErrors(options) // globally catch unhandled errors

      app = express()
      const log = logMessages(options)

      server = app.listen(options.port, options.host, async err => {
        if (err) {
          return reject(err)
        }

        const loadedMiddleware = await middlewareLoad(app, options)

        log.server.listening(options.host, options.port)
        log.middleware.initialized(loadedMiddleware)

        if (options.isDev) {
          initDevelopment(app, options, dbConnection => {
            db = dbConnection
          }).then(({ dbConnection, watcherInstance }) => {
            db = dbConnection
            watcher = watcherInstance

            resolve({ app, server, watcher, db })
          })
        } else {
          initProduction(app, options).then(({ dbConnection }) => {
            db = dbConnection

            resolve({ app, server, db })
          })
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
