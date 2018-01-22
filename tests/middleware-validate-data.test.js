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

  it('should throw an error with a custom function for body', () => {
    const schema = { body () { throw new Error('body') } }
    const body = { test: 'body' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ body }, resFn, nextFn)).toThrow('body')
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error with a custom function for params', () => {
    const schema = { params () { throw new Error('params') } }
    const params = { test: 'params' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ params }, resFn, nextFn)).toThrow('params')
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error with a custom function for query', () => {
    const schema = { query () { throw new Error('query') } }
    const query = { test: 'query' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ query }, resFn, nextFn)).toThrow('query')
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error if the body schema isnt an object or a function', () => {
    const schema = { body: 'nope' }
    const body = { test: 'body' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ body }, resFn, nextFn)).toThrow(`Schema 'body' must be an object or a function`)
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error if the params schema isnt an object or a function', () => {
    const schema = { params: 'nope' }
    const params = { test: 'params' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ params }, resFn, nextFn)).toThrow(`Schema 'params' must be an object or a function`)
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error if the params schema isnt an object or a function', () => {
    const schema = { params: 'nope' }
    const params = { test: 'params' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ params }, resFn, nextFn)).toThrow(`Schema 'params' must be an object or a function`)
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should throw an error if the query schema isnt an object or a function', () => {
    const schema = { query: 'nope' }
    const query = { test: 'query' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    expect(() => middleware({ query }, resFn, nextFn)).toThrow(`Schema 'query' must be an object or a function`)
    expect(nextFn.mock.calls.length).toBe(0)
  })

  it('should pass a context object to validation functions', () => {
    const cb = jest.fn()
    const schema = { body (context) { cb(context) } }
    const body = { test: 'body' }
    const resFn = jest.fn()
    const nextFn = jest.fn()
    const middleware = middlewareValidateData({ schema })

    middleware({ body }, resFn, nextFn)

    const { calls } = cb.mock

    expect(calls.length).toBe(1)
    expect(calls[0][0].req).toBeTruthy()
    expect(calls[0][0].res).toBeTruthy()
    expect(calls[0][0].next).toBeTruthy()
    expect(calls[0][0].data).toEqual(body)
    expect(calls[0][0].struct).toBeTruthy()
    expect(calls[0][0].superstruct).toBeTruthy()
    expect(calls[0][0]._).toBeTruthy()
    expect(nextFn.mock.calls.length).toBe(1)
  })
})
