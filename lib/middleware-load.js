const { basename } = require('path')
const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const middlewareParser = require('./middleware-parser')
const serveStatic = require('./serve-static')
const logMessages = require('./log-messages')

module.exports = async (app, options = {}) => {
  const log = logMessages(options)
  const middlewaresPaths = glob.sync(options.middlewaresGlob)
  const loaded = ['express.json']

  if (existsSync(options.staticPath)) {
    loaded.unshift('express.static')
    serveStatic(app, options)
  }

  app.use(express.json(options.jsonOptions))

  await middlewaresPaths.forEach(middlewarePath => {
    return middlewareParser(middlewarePath, options)
      .then(middlewares => {
        app.use(middlewares)
        loaded.push(basename(middlewarePath, '.js'))
      })
      .catch(err => log.middleware.error(err))
  })

  return loaded
}
