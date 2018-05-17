const { join, dirname } = require('path')
const { merge } = require('lodash')
const { existsSync } = require('fs')
const importFresh = require('import-fresh')
const { load } = require('dotenv-extended')

const cwd = process.cwd()
const cwdConfigPath = join(cwd, 'teil.config.js')
const jsGlob = '!(*test|*spec|*draft).js'
const isProduction = process.env.NODE_ENV === 'production'

module.exports = (configPath = cwdConfigPath, customOptions = {}) => {
  const projectPath = dirname(configPath)
  const envPath = join(projectPath, '.env')
  const envDefaultsPath = join(projectPath, '.env.defaults')
  const envSchemaPath = join(projectPath, '.env.schema')

  load({ path: envPath, defaults: envDefaultsPath, schema: envSchemaPath })

  const defaults = {
    isDev: !isProduction,

    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3003,

    apiEndpoint: '/api',

    staticEndpoint: '/',
    staticPath: join(cwd, 'static'),
    staticOptions: {},

    jsonOptions: {},

    sessionOptions: {
      secret: process.env.SESSION_SECRET || 'SET THIS IN PRODUCTION!',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      resave: false,
      saveUninitialized: true,
      secure: isProduction,
      storeOptions: {}
    },

    expressSettings: {},

    controllersGlob: join(cwd, 'controllers/**', jsGlob),
    modelsGlob: join(cwd, 'models/**', jsGlob),
    middlewaresGlobalGlob: join(cwd, 'middlewares/**', `!(_*)${jsGlob}`),
    middlewaresLocalGlob: join(cwd, 'middlewares/**', `(_*)${jsGlob}`),
    // hooksGlob: join(cwd, 'hooks/**/', jsGlob),

    logger: {
      level: 'info', // TODO implement levels
      olologOptions: {}
    },

    database: {
      url: process.env.DATABASE_URL || 'mongodb://localhost/teil',
      mongoose: {},
      mongod: {
        logpath: join(cwd, 'db/mongod.log'),
        dbpath: join(cwd, 'db'),
        bind_ip: '127.0.0.1',
        logappend: true,
        fork: true
      }
    }
  }

  let configOptions = {}

  if (configPath.length && existsSync(configPath)) {
    configOptions = importFresh(configPath)
  }

  return merge({}, defaults, configOptions, customOptions)
}
