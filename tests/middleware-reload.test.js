const { join } = require('path')
const { isFunction } = require('lodash')
const middlewareReload = require('../lib/middleware-reload')

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
  return () => {}
})

jest.mock('express-session', opt => {
  return () => {
    return { middleware: 'session', opt }
  }
})

describe('Middleware Reload', () => {
  it('should reload just the middleware of the router stack', () => {
    const app = {
      use: jest.fn(),
      _router: {
        stack: ['query', 'expressInit', 'middleware1', 'middleware2', 'router']
      }
    }
    const options = {
      middlewaresGlobalGlob: join(__dirname, 'fixtures/middlewares/valid-*.js'),
      modelsGlob: join(__dirname, 'nope'),
      staticEndpoint: '/static-endpoint',
      staticPath: join(__dirname, '../example/static')
    }

    return middlewareReload(app, options).then(() => {
      const { stack } = app._router
      const { calls } = app.use.mock

      expect(stack[0]).toBe('query')
      expect(stack[1]).toBe('expressInit')
      expect(stack[2]).toBe('router')
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
})
