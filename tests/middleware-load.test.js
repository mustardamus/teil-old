const { join } = require('path')
const { isFunction } = require('lodash')
const middlewareLoad = require('../lib/middleware-load')

jest.mock('express', () => {
  return {
    json (opt) {
      return { middleware: 'json', opt }
    },

    static (opt) {
      return { middleware: 'static', opt }
    }
  }
})

jest.mock('connect-mongo', () => {
  return () => {
    class MongoStore {}
    return MongoStore
  }
})

jest.mock('express-session', () => {
  return opt => {
    return { middleware: 'session', opt }
  }
})

describe('Middleware Load', () => {
  it('should load the express.json middleware by default', () => {
    const app = { use: jest.fn() }
    const options = {
      middlewaresGlobalGlob: 'non-existend',
      modelsGlob: 'nope'
    }

    return middlewareLoad(app, options).then(() => {
      const { calls } = app.use.mock

      expect(calls.length).toBe(2)
      expect(calls[0][0].middleware).toBe('json')
      expect(calls[1][0].middleware).toBe('session')
    })
  })

  it('should load the express.static middleware if a static folder exists', () => {
    const app = { use: jest.fn() }
    const options = {
      middlewaresGlobalGlob: 'non-existend',
      staticEndpoint: '/static-endpoint',
      staticPath: join(__dirname, '../example/static'),
      modelsGlob: 'nope'
    }

    return middlewareLoad(app, options).then(() => {
      const { calls } = app.use.mock

      expect(calls.length).toBe(3)
      expect(calls[0][0]).toBe('/static-endpoint')
      expect(calls[0][1].middleware).toBe('static')
      expect(calls[1][0].middleware).toBe('json')
      expect(calls[2][0].middleware).toBe('session')
    })
  })

  it('should load the middlewares from a glob', () => {
    const app = { use: jest.fn() }
    const options = {
      middlewaresGlobalGlob: join(__dirname, 'fixtures/middlewares/valid-*.js'),
      staticEndpoint: '/static-endpoint',
      staticPath: join(__dirname, '../example/static'),
      modelsGlob: 'nope'
    }

    return middlewareLoad(app, options).then(() => {
      const { calls } = app.use.mock

      expect(calls.length).toBe(5)
      expect(calls[0][0]).toBe('/static-endpoint')
      expect(calls[0][1].middleware).toBe('static')
      expect(calls[1][0].middleware).toBe('json')
      expect(calls[2][0].middleware).toBe('session')
      expect(calls[3][0].length).toBe(2) // fixtures/middlewares/valid-multi-functions.js
      expect(isFunction(calls[3][0][0])).toBe(true)
      expect(isFunction(calls[3][0][1])).toBe(true)
      expect(calls[4][0].length).toBe(1) // fixtures/middlewares/valid-single-function.js
      expect(isFunction(calls[4][0][0])).toBe(true)
    })
  })

  it('should use a mongo store if a database connection exists', () => {
    const app = { use: jest.fn() }
    const options = {
      middlewaresGlobalGlob: 'non-existend',
      modelsGlob: join(__dirname, 'fixtures/models/full-example.js'),
      sessionOptions: {
        storeOptions: {}
      }
    }

    return middlewareLoad(app, options).then(() => {
      const { calls } = app.use.mock

      expect(calls.length).toBe(2)
      expect(calls[0][0].middleware).toBe('json')
      expect(calls[1][0].middleware).toBe('session')
      expect(calls[1][0].opt.store).toBeTruthy()
    })
  })
})
