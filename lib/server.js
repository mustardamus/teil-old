const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')
const optionsBuilder = require('../lib/options-builder')

let app
let watcher

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise((resolve, reject) => {
      // TODO --config-file cli argument (null above)
      const options = optionsBuilder(configPath, customOptions)
      app = fastify(options)
      const events = controllersEvents(app, options)

      app.listen(options.port, function (err) {
        if (err) {
          return reject(err)
        }

        watcher = fileWatcher([
          {
            glob: options.controllersGlob,
            cb (location) {
              events[location.eventName](location)
            }
          }
        ])

        watcher.on('ready', () => {
          resolve(app)
        })
      })
    })
  },

  stop () {
    app.close()
    watcher.close()
  }
}
