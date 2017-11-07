const { join } = require('path')
const useMiddleware = require('../lib/use-middleware')

const fixDir = join(__dirname, 'fixtures/middlewares')

describe('Use Middleware', () => {
  it('should use a single exported function', () => {
    const app = { use: jest.fn() }
    const middlewares = useMiddleware(app, {
      middlewaresGlob: join(fixDir, 'valid-single-function.js')
    })

    expect(middlewares).toEqual(['valid-single-function'])
    expect(app.use.mock.calls.length).toBe(1)
  })

  it('should use a array of exported functions', () => {
    const app = { use: jest.fn() }
    const middlewares = useMiddleware(app, {
      middlewaresGlob: join(fixDir, 'valid-multi-functions.js')
    })

    expect(middlewares).toEqual(['valid-multi-functions'])
    expect(app.use.mock.calls.length).toBe(2)
  })

  it('should throw an error if no function or array was exported', () => {
    const app = { use: jest.fn() }
    const opt = {
      middlewaresGlob: join(fixDir, 'invalid-export.js')
    }

    expect(() => useMiddleware(app, opt)).toThrow()
  })
})
