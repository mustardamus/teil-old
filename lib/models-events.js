// const { basename } = require('path')
const modelParser = require('./model-parser')
const logger = require('./logger')

module.exports = (app, options = {}) => {
  const log = logger(options)

  return {
    add (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Added Model: ${model.name}`)
        })
        .catch(err => log.error(err))
    },

    change (location) {
      modelParser(location.filePath)
        .then(model => {
          log.info(`Updated Model: ${model.name}`)
        })
        .catch(err => log.error(err))
    },

    unlink (location) {
      log.info(`Removed Model: ${location.fileName}`)
    }
  }
}
