const { join } = require('path')
const { merge, isFunction } = require('lodash')
const optionsBuilder = require('./options-builder')
const initMain = require('./init-main')

module.exports = async function (moduleOptions) {
  if (!this.nuxt) {
    throw new Error('Only available as Nuxt module')
  }

  if (process.env.npm_lifecycle_event === 'build') {
    // test if `npm run build` was called, if so, the middleware must not be
    // inserted, doesn't work if behind another npm command, but it wont break
    // either
    return
  }

  const cwd = process.cwd()
  const configPath = join(cwd, 'teil.config.js')
  const { srcDir } = this.options
  const jsGlob = '!(*test|*spec|*draft).js'
  const defaultOptions = {
    isDev: this.options.dev,
    controllersGlob: join(srcDir, 'controllers/**', jsGlob),
    modelsGlob: join(srcDir, 'models/**', jsGlob),
    middlewaresGlobalGlob: join(srcDir, 'server-middleware/**', `!(_*)${jsGlob}`),
    middlewaresLocalGlob: join(srcDir, 'server-middleware/**', `(_*)${jsGlob}`)
  }
  const customOptions = merge({}, defaultOptions, moduleOptions)
  const options = optionsBuilder(configPath, customOptions)
  const { apiEndpoint } = options
  const { app, watcher, db } = await initMain(options)

  const closeConnections = () => {
    if (watcher && isFunction(watcher.close)) {
      watcher.close()
    }

    if (db && isFunction(db.close)) {
      db.close()
    }

    process.exit()
  }

  process.on('exit', closeConnections)
  process.on('SIGINT', closeConnections)

  this.addServerMiddleware({ path: '/', handler: app._router })

  // here we use a custom error middleware in nuxt to not send a response twice
  this.nuxt.hook('render:errorMiddleware', app => {
    app.use((err, req, res, next) => {
      if (req.path.substr(0, apiEndpoint.length) !== apiEndpoint) {
        // if error did not originate on Teil's apiEndpoint, just pass it along
        // to Nuxt error middleware
        next(err)
      } else {
        // otherwise just print out the error, since response was already sent
        // note that console.error is already prettyfied by the logger
        console.error(err)
      }
    })
  })
}
