const express = require('express')
const { isFunction } = require('lodash')
const unhandledErrors = require('./unhandled-errors')
const optionsBuilder = require('./options-builder')
const middlewareLoad = require('./middleware-load')
const initDevelopment = require('./init-development')
const initProduction = require('./init-production')

let app, watcher, db

const closeConnections = () => {
  if (watcher && isFunction(watcher.close)) {
    watcher.close()
  }

  if (db && isFunction(db.close)) {
    db.close()
  }
}

module.exports = (configPath = '', customOptions = {}) => {
  return new Promise((resolve, reject) => {
    const options = optionsBuilder(configPath, customOptions)

    unhandledErrors(options) // globally catch unhandled errors

    process.on('exit', closeConnections)
    process.on('SIGINT', closeConnections)

    app = express()

    middlewareLoad(app, options)

    if (options.isDev) {
      initDevelopment(app, options, dbConnection => {
        db = dbConnection
      }).then(({ dbConnection, watcherInstance }) => {
        db = dbConnection
        watcher = watcherInstance

        resolve(app._router)
      })
    } else {
      initProduction(app, options).then(({ dbConnection }) => {
        db = dbConnection

        resolve(app._router)
      })
    }
  })
}
