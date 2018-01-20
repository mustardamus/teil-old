const middlewareValidateData = require('../lib/middleware-validate-data')

describe('Middleware Data Validation', () => {
  it('should export a middleware function', () => {
    const middleware = middlewareValidateData({ schema: {} })

    expect(typeof middleware).toBe('function')
    expect(middleware.length).toBe(3)
  })

  it('should throw an error with invalid data when a object is passed to body', () => {
    const schema = { body: { test: 'string' } }
    const body = { test: false }
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ body })).toThrow()
  })

  it('should throw an error with invalid data when a object is passed to params', () => {
    const schema = { params: { test: 'string' } }
    const params = { test: false }
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ params })).toThrow()
  })

  it('should throw an error with invalid data when a object is passed to query', () => {
    const schema = { params: { test: 'string' } }
    const query = { test: false }
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ query })).toThrow()
  })
})
