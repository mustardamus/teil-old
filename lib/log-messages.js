const logger = require('./logger')
const { removeCwd } = require('./helpers')

module.exports = (options = {}) => {
  const logInstance = logger(options)
  const log = (category, msg, level = 'info') => {
    logInstance[level]('[teil]'.lightCyan + `[${category}]`.cyan, msg)
  }
  const colorMiddlewares = middlewares => {
    return middlewares.map(m => {
      if (m.includes('express.')) {
        return m.lightYellow
      } else {
        return m.green
      }
    })
  }

  return {
    server: {
      listening (host, port) {
        log('server', `Listening to ${`http://${host}:${port}`.yellow}`)
      }
    },

    database: {
      noModels () {
        log('database', 'No models found, skip database connection')
      },

      connected (url) {
        log('database', `Connected to ${url.yellow}`)
      },

      error (err) {
        log('database', err, 'error')
      }
    },

    dev: {
      watchFiles (location) {
        log('dev', `Watching files at ${removeCwd(location).yellow}`)
      }
    },

    static: {
      serving (path, endpoint) {
        log('static', `Serve static files from ${removeCwd(path).yellow} at ${removeCwd(endpoint).green}`)
      },

      notFound () {
        log('static', 'No static folder found, skip middleware')
      }
    },

    middleware: {
      initialized (middlewares) {
        log('middleware', `Initialized ${colorMiddlewares(middlewares).join(' -> ')}`)
      },

      updated (middlewares) {
        log('middleware', `Updated ${colorMiddlewares(middlewares).join(' -> ')}`)
      },

      error (err) {
        log('middleware', err.message, 'error')
      }
    }
  }
}
