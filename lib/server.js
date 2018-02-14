const { isFunction } = require('lodash')
const optionsBuilder = require('./options-builder')
const logMessages = require('./log-messages')
const initMain = require('./init-main')

let app, server, watcher, db

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise(async (resolve, reject) => {
      const options = optionsBuilder(configPath, customOptions)
      const instances = await initMain(options, dbConnection => {
        db = dbConnection
      })
      app = instances.app
      watcher = instances.watcher
      db = instances.db
      const log = logMessages(options)

      server = app.listen(options.port, options.host, err => {
        if (err) {
          return reject(err)
        }

        log.server.listening(options.host, options.port)
        resolve({ app, server, watcher, db })
      })
    })
  },

  stop () {
    if (server && isFunction(server.close)) {
      server.close()
    }

    if (watcher && isFunction(watcher.close)) {
      watcher.close()
    }

    if (db && isFunction(db.close)) {
      db.close()
    }
  }
}
