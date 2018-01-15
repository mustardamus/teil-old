const { basename } = require('path')
const glob = require('glob')
const logger = require('./logger')
const { makeCleanUrl } = require('./helpers')
const routerBuilder = require('./router-builder')
const routerReplace = require('./router-replace')
const controllerParser = require('./controller-parser')

module.exports = (app, options = {}) => {
  const log = logger(options)
  const apiEndpoint = makeCleanUrl(options.apiEndpoint)

  const logController = (action, controllerPath) => {
    const resourceName = basename(controllerPath, '.js').toLowerCase()

    controllerParser(controllerPath, options)
      .then(controller => {
        const routes = controller.map(route => {
          const shortUrl = route.url.replace(`/${resourceName}`, '')
          return `${route.method.lightYellow} ${shortUrl.green}`
        })

        log.info('[teil]'.lightCyan + '[routes]'.cyan + ` ${action} ${`${apiEndpoint}/${resourceName}`.green} ${routes.length ? '->' : ''} ${routes.join(' | ')}`)
      })
      .catch(err => log.error(err.message))
  }

  return {
    init: async () => {
      const router = await routerBuilder(options)
      const controllerPaths = glob.sync(options.controllersGlob)

      app.use(apiEndpoint, router)

      controllerPaths.forEach(controllerPath => {
        logController('Initialized', controllerPath)
      })
    },

    add: async location => {
      const router = await routerBuilder(options)

      routerReplace(app, router, options)
      logController('Added', location.filePath)
    },

    change: async location => {
      const router = await routerBuilder(options)

      routerReplace(app, router, options)
      logController('Updated', location.filePath)
    },

    unlink: async location => {
      const router = await routerBuilder(options)
      const resourceName = basename(location.filePath, '.js').toLowerCase()

      routerReplace(app, router, options)
      log.info('[teil]'.lightCyan + '[routes]'.cyan + ` Removed ${`${apiEndpoint}/${resourceName}`.lightYellow}`)
    }
  }
}
