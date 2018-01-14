// const { basename } = require('path')
const glob = require('glob')
const modelParser = require('./model-parser')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const log = logger(options)

  return {
    init () {
      const modelPaths = glob.sync(options.modelsGlob)

      modelPaths.forEach(modelPath => {
        modelParser(modelPath)
          .then(model => {
            log.info(`Initialized Model: ${model.name.green}`)
          })
          .catch(err => log.error(err.message))
      })
    },

    add (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Added Model: ${model.name.green}`)
        })
        .catch(err => log.error(err.message))
    },

    change (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Updated Model: ${model.name.green}`)
        })
        .catch(err => log.error(err.message))
    },

    unlink (location) {
      log.info(`Removed Model: ${location.fileName.yellow}`)
    }
  }
}
