const { existsSync } = require('fs')
const express = require('express')
const { isFunction } = require('lodash')
const unhandledErrors = require('./unhandled-errors')
const optionsBuilder = require('./options-builder')
const logger = require('./logger')
const useMiddlewares = require('./use-middlewares')
const { makeCleanUrl, removeCwd } = require('./helpers')
const developmentInit = require('./development-init')

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

        app.use(express.json()) // TODO custom options passing

        const hasStaticPath = existsSync(options.staticPath)
        const middlewares = [
          'express.json'.lightYellow,
          ...useMiddlewares(app, options).map(m => m.green)
        ]

        log('server', `Listening to ${`http://localhost:${options.port}`.yellow}`)

        if (hasStaticPath) { // TODO have a watcher for the static path, if added use middleware
          const staticPath = removeCwd(options.staticPath)
          const staticEndpoint = makeCleanUrl(options.staticEndpoint)

          app.use(staticEndpoint, express.static(options.staticPath)) // TODO custom options passing
          middlewares.unshift('express.static'.lightYellow)
          log('server', `Serve static files from ${staticPath.yellow} at ${staticEndpoint.green}`)
        }

        log('server', `Use middlewares ${middlewares.join(' -> ')}`)

        if (options.dev) {
          developmentInit(app, options, dbConnection => {
            db = dbConnection
          }).then(({ dbConnection, watcherInstance }) => {
            db = dbConnection
            watcher = watcherInstance

            resolve({ app, server, watcher, db })
          })
        } else {
          // TODO production-init.js
          /* ctrlEvents.init()
          modEvents.init()
          connectDb() */
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
