const { basename } = require('path')
const { existsSync } = require('fs')
const express = require('express')
const glob = require('glob')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const { merge } = require('lodash')
const middlewareParser = require('./middleware-parser')
const serveStatic = require('./serve-static')
const logMessages = require('./log-messages')

module.exports = async (app, options = {}) => {
  const log = logMessages(options)
  const middlewaresPaths = glob.sync(options.middlewaresGlobalGlob)
  const initModelsCount = glob.sync(options.modelsGlob).length
  const loaded = ['express.json', 'express-session']

  if (existsSync(options.staticPath)) {
    loaded.unshift('express.static')
    serveStatic(app, options)
  }

  if (initModelsCount !== 0) { // database connection was established
    const storeOptions = merge({}, {
      mongooseConnection: mongoose.connection
    }, options.sessionOptions.storeOptions)

    options.sessionOptions.store = new MongoStore(storeOptions)
  }

  app.use(express.json(options.jsonOptions))
  app.use(session(options.sessionOptions))

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
