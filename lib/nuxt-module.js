const { join } = require('path')
const { merge, isFunction } = require('lodash')
const optionsBuilder = require('./options-builder')
const initMain = require('./init-main')

module.exports = async function (moduleOptions) {
  if (!this.nuxt) {
    throw new Error('Only available as Nuxt module')
  }

  const cwd = process.cwd()
  const configPath = join(cwd, 'teil.config.js')
  const { srcDir } = this.options
  const jsGlob = '!(*test|*spec|*draft).js'
  const defaultOptions = {
    isDev: this.options.dev,
    controllersGlob: join(srcDir, 'controllers/**', jsGlob),
    modelsGlob: join(srcDir, 'models/**', jsGlob),
    middlewaresGlob: join(srcDir, 'server-middleware/**', jsGlob)
  }
  const customOptions = merge({}, defaultOptions, moduleOptions)
  const options = optionsBuilder(configPath, customOptions)
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
}
