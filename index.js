const { join } = require('path')
const { merge } = require('lodash')
const middleware = require('./lib/middleware')

module.exports = async function (moduleOptions) {
  if (!this.nuxt) {
    throw new Error('Only available as Nuxt module')
  }

  const cwd = process.cwd()
  const configFile = join(cwd, 'teil.config.js')
  const { srcDir } = this.options
  const jsGlob = '!(*test|*spec|*draft).js'
  const defaultOptions = {
    isDev: this.options.dev,
    controllersGlob: join(srcDir, 'controllers/**', jsGlob),
    modelsGlob: join(srcDir, 'models/**', jsGlob),
    middlewaresGlob: join(srcDir, 'server-middleware/**', jsGlob)
  }
  const customOptions = merge({}, defaultOptions, moduleOptions)
  const handler = await middleware(configFile, customOptions)

  this.addServerMiddleware({ path: '/', handler })
}
