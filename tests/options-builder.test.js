const { join } = require('path')
const optionsBuilder = require('../lib/options-builder')

describe('Options Builder', () => {
  it('should return the default options', () => {
    const opt = optionsBuilder()

    expect(opt.controllersGlob.includes('controllers/**/!(*test|*spec|*draft).js')).toBe(true)
    expect(opt.modelsGlob.includes('models/**/!(*test|*spec|*draft).js')).toBe(true)
    expect(opt.middlewaresGlobalGlob.includes('middlewares/**/!(_*)!(*test|*spec|*draft).js')).toBe(true)
    expect(opt.middlewaresLocalGlob.includes('middlewares/**/(_*)!(*test|*spec|*draft).js')).toBe(true)
    // expect(opt.hooksGlob.includes('hooks/**/!(*test|*spec|*draft).js')).toBe(true)
    expect(opt.logger.level).toBe('info')
    expect(opt.logger.olologOptions).toEqual({})
    expect(opt.isDev).toBe(true)
    expect(opt.host).toBe('0.0.0.0')
    expect(opt.port).toBe(3003)
    expect(opt.apiEndpoint).toBe('/api')
    expect(opt.staticEndpoint).toBe('/')
    expect(opt.staticPath).toBe(join(process.cwd(), 'static'))
    expect(opt.staticOptions).toEqual({})
    expect(opt.jsonOptions).toEqual({})
    expect(opt.expressSettings).toEqual({})
    expect(opt.database.url).toBe('mongodb://localhost/teil')
    expect(opt.database.mongoose).toEqual({})
    expect(opt.database.mongod.logpath).toBeTruthy()
    expect(opt.database.mongod.dbpath).toBeTruthy()
    expect(opt.database.mongod.bind_ip).toBe('127.0.0.1')
    expect(opt.database.mongod.logappend).toBe(true)
    expect(opt.database.mongod.fork).toBe(true)
    expect(opt.sessionOptions).toEqual({
      secret: 'SET THIS IN PRODUCTION!',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      resave: false,
      saveUninitialized: true,
      secure: false,
      storeOptions: {}
    })
  })

  it('should overwrite the default options with a config file', () => {
    const configPath = join(__dirname, '../example/teil.config.js')
    const opt = optionsBuilder(configPath)

    expect(opt.controllersGlob.includes('example/controllers/*.js')).toBe(true)
    expect(opt.modelsGlob.includes('example/models/*.js')).toBe(true)
    expect(opt.database.url).toBe('mongodb://localhost/teil-test')
  })

  it('should overwrite the default and config options with passed in custom options', () => {
    const configPath = join(__dirname, '../example/teil.config.js')
    const opt = optionsBuilder(configPath, {
      modelsGlob: '*.js',
      database: { url: 'works' }
    })

    expect(opt.modelsGlob).toBe('*.js')
    expect(opt.database.url).toBe('works')
  })

  it('should use environment variables for certain options', () => {
    process.env.HOST = 'localhost'
    process.env.PORT = 9898
    process.env.DATABASE_URL = 'mongod://localhost/custom'
    const opt = optionsBuilder()

    expect(opt.host).toBe(process.env.HOST)
    expect(opt.port).toBe(process.env.PORT)
    expect(opt.database.url).toBe(process.env.DATABASE_URL)
  })
})
