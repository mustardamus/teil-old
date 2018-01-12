// const { basename } = require('path')
const glob = require('glob')
const { green, red } = require('chalk')
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
            log.info(`Initialized Model: ${green(model.name)}`)
          })
          .catch(err => log.error(red(err.message)))
      })
    },

    add (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Added Model: ${green(model.name)}`)
        })
        .catch(err => log.error(red(err.message)))
    },

    change (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Updated Model: ${green(model.name)}`)
        })
        .catch(err => log.error(red(err.message)))
    },

    unlink (location) {
      log.info(`Removed Model: ${location.fileName}`)
    }
  }
}
