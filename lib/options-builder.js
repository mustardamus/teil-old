const { join } = require('path')
const { assign } = require('lodash')
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
      mongooseOptions: {
        useMongoClient: true
      }
    }
  }
  let configOptions = {}

  if (existsSync(configPath)) {
    configOptions = importFresh(configPath)
  }

  const options = assign({}, defaults, configOptions, customOptions)

  if (!options.database.mongooseOptions) {
    options.database.mongooseOptions = defaults.database.mongooseOptions
  }

  return options
}
