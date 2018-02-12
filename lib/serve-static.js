const express = require('express')
const { makeCleanUrl } = require('./helpers')

module.exports = (app, options = {}) => {
  const staticEndpoint = makeCleanUrl(options.staticEndpoint)
  app.use(staticEndpoint, express.static(options.staticPath, options.staticOptions))
}
