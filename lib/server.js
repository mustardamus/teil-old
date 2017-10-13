const fastify = require('fastify')
const fileWatcher = require('../lib/file-watcher')
const controllersEvents = require('../lib/controllers-events')
const optionsBuilder = require('../lib/options-builder')

const app = fastify()
let watcher

module.exports = {
  start (configPath = '', customOptions = {}) {
    return new Promise((resolve, reject) => {
      const options = optionsBuilder(configPath, customOptions)
      // TODO --config-file cli argument (null above)

      app.listen(options.port, function (err) {
        if (err) {
          return reject(err)
        }

        watcher = fileWatcher([
          {
            glob: options.controllersGlob, // join(process.cwd(), 'controllers/*.js'),
            cb (location) {
              controllersEvents[location.eventName]({ location, app, options })
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
