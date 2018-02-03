const { join } = require('path')
const { merge } = require('lodash')
const { existsSync } = require('fs')
const importFresh = require('import-fresh')

const cwd = process.cwd()
const cwdConfigPath = join(cwd, 'teil.config.js')
const jsGlob = '!(*test|*spec|*draft).js'

module.exports = (configPath = cwdConfigPath, customOptions = {}) => {
  const defaults = {
    isDev: !(process.env.NODE_ENV === 'production'),
    port: 3003,
    apiEndpoint: '/api',
    staticEndpoint: '/',

    controllersGlob: join(cwd, 'controllers/**', jsGlob),
    modelsGlob: join(cwd, 'models/**', jsGlob),
    middlewaresGlob: join(cwd, 'middlewares/**', jsGlob),
    hooksGlob: join(cwd, 'hooks/**/', jsGlob),

    logger: {
      level: 'info',
      prettyPrint: true
    },

    database: {
      url: 'mongodb://localhost/teil',
      mongoose: {},
      mongod: {
        logpath: join(cwd, 'db/mongod.log'),
        dbpath: join(cwd, 'db'),
        bind_ip: '127.0.0.1',
        logappend: true,
        fork: true
      }
    },

    staticPath: join(cwd, 'static')
  }

  let configOptions = {}

  if (configPath.length && existsSync(configPath)) {
    configOptions = importFresh(configPath)
  }

  return merge({}, defaults, configOptions, customOptions)
}
