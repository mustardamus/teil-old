const { join } = require('path')
const { merge } = require('lodash')
const { existsSync } = require('fs')
const importFresh = require('import-fresh')

const cwd = process.cwd()
const cwdConfigPath = join(cwd, 'teil.config.js')
const jsGlob = '!(*test|*spec|*draft).js'

module.exports = (configPath = cwdConfigPath, customOptions = {}) => {
  const defaults = {
    dev: !(process.env.NODE_ENV === 'production'),
    port: 3003,
    controllersGlob: join(cwd, 'controllers/**', jsGlob),
    modelsGlob: join(cwd, 'models/**', jsGlob),
    logger: {
      level: 'info',
      prettyPrint: true
    },
    database: {
      url: 'mongodb://localhost/teil',
      mongoose: {
        useMongoClient: true
      },
      mongod: {
        logpath: join(cwd, 'db/mongod.log'),
        dbpath: join(cwd, 'db'),
        bind_ip: '127.0.0.1',
        logappend: true,
        fork: true
      }
    }
  }
  let configOptions = {}

  if (configPath.length) {
    if (existsSync(configPath)) {
      configOptions = importFresh(configPath)
    } else {
      // throw new Error(`Could not find config file at '${configPath}'`)
      console.warn(`Could not find config file at '${configPath}'`)
    }
  }

  return merge({}, defaults, configOptions, customOptions)
}
