const { join } = require('path')
const { assign } = require('lodash')
const { existsSync } = require('fs')
const importFresh = require('import-fresh')

const cwd = process.cwd()
const cwdConfigPath = join(cwd, 'teil.config.js')
const jsGlob = '!(*test|*spec|*draft).js'
const defaults = {
  port: 3003,
  controllersGlob: join(cwd, 'controllers/**', jsGlob),
  modelsGlob: join(cwd, 'models/**', jsGlob)
}

module.exports = (configPath = cwdConfigPath, customOptions = {}) => {
  let configOptions = {}

  if (existsSync(configPath)) {
    configOptions = importFresh(configPath)
  }

  return assign({}, defaults, configOptions, customOptions)
}
