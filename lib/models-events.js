const { basename } = require('path')
const glob = require('glob')
const { capitalize } = require('lodash')
const modelParser = require('./model-parser')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const logInstance = logger(options)
  const log = (action, msg) => {
    logInstance.info('[teil]'.lightCyan + '[models]'.cyan + ` ${action} ${msg}`)
  }

  return {
    init: async () => {
      const modelPaths = glob.sync(options.modelsGlob)
      const models = []

      await modelPaths.forEach(modelPath => {
        modelParser(modelPath)
          .then(model => models.push(model.name.green))
          .catch(err => logInstance.error(err.message))
      })

      log('Initialized', models.join(' | '))
    },

    add (location) {
      modelParser(location.filePath)
        .then(model => log('Added', model.name.green))
        .catch(err => logInstance.error(err.message))
    },

    change (location) {
      modelParser(location.filePath)
        .then(model => log('Updated', model.name.green))
        .catch(err => logInstance.error(err.message))
    },

    unlink (location) {
      const modelName = basename(location.filePath, '.js')
      log('Removed', capitalize(modelName).lightYellow)
    }
  }
}
