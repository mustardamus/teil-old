const { join } = require('path')
const middleware = require('./lib/middleware')

module.exports = async function (moduleOptions) {
  if (!this.nuxt) {
    throw new Error('Only available as Nuxt module')
  }

  const cwd = process.cwd()
  const configFile = join(cwd, 'teil.config.js')
  const handler = await middleware(configFile, moduleOptions)

  this.addServerMiddleware({ path: '/', handler })
}
