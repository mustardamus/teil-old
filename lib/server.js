const express = require('express')
const { isFunction } = require('lodash')
const unhandledErrors = require('./unhandled-errors')
const optionsBuilder = require('./options-builder')
const logger = require('./logger')
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
      const logInstance = logger(options)

      const log = (category, msg) => {
        logInstance.info('[teil]'.lightCyan + `[${category}]`.cyan + ' ' + msg)
      }

      server = app.listen(options.port, err => {
        if (err) {
          return reject(err)
        }

        log('server', `Listening to ${`http://localhost:${options.port}`.yellow}`)

        middlewareLoad(app, options)

        if (options.dev) {
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
