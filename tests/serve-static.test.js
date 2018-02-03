const { join } = require('path')
const serveStatic = require('../lib/serve-static')

jest.mock('express', () => {
  return {
    static (opt) {
      return { middleware: 'static', opt }
    }
  }
})

describe('Serve Static', () => {
  it('should apply the express.static middleware to the app', () => {
    const app = { use: jest.fn() }
    const options = {
      staticEndpoint: '/static-endpoint',
      staticPath: join(__dirname, '../example/static')
    }

    serveStatic(app, options)

    const { calls } = app.use.mock

    expect(calls.length).toBe(1)
    expect(calls[0][0]).toBe('/static-endpoint')
    expect(calls[0][1].middleware).toBe('static')
  })
})
