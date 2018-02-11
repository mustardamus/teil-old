const express = require('express')
const logger = require('./logger')
const { makeCleanUrl, removeCwd } = require('./helpers')

module.exports = (app, options = {}) => {
  const log = logger(options)
  const staticPath = removeCwd(options.staticPath)
  const staticEndpoint = makeCleanUrl(options.staticEndpoint)

  app.use(staticEndpoint, express.static(options.staticPath, options.staticOptions))
  log.info('[teil]'.lightCyan + '[static]'.cyan, `Serve static files from ${staticPath.yellow} at ${staticEndpoint.green}`)
}
