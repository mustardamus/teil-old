const { basename } = require('path')
const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const middlewareParser = require('./middleware-parser')
const logger = require('./logger')
const { makeCleanUrl, removeCwd } = require('./helpers')

module.exports = async (app, options = {}) => {
  const logInstance = logger(options)
  const middlewaresPaths = glob.sync(options.middlewaresGlob)
  const loaded = ['express.json'.lightYellow]

  const log = (category, msg, level = 'info') => {
    logInstance[level]('[teil]'.lightCyan + `[${category}]`.cyan, msg)
  }

  if (existsSync(options.staticPath)) {
    const staticPath = removeCwd(options.staticPath)
    const staticEndpoint = makeCleanUrl(options.staticEndpoint)

    loaded.unshift('express.static'.lightYellow)
    app.use(staticEndpoint, express.static(options.staticPath)) // TODO custom options passing
    log('static', `Serve static files from ${staticPath.yellow} at ${staticEndpoint.green}`)
  } else {
    log('static', 'No static folder found, skip middleware')
  }

  app.use(express.json())

  await middlewaresPaths.forEach(middlewarePath => {
    return middlewareParser(middlewarePath, options)
      .then(middlewares => {
        app.use(middlewares)
        loaded.push(basename(middlewarePath, '.js').green)
      })
      .catch(err => log('middleware', err.message, 'error'))
  })

  log('middleware', `Initialized ${loaded.join(' -> ')}`)
}
