const middlewareErrorHandling = require('../lib/middleware-error-handling')

const middleware = middlewareErrorHandling()

describe('Middleware Error Handling', () => {
  it('should export a error handling middleware function', () => {
    expect(typeof middleware).toBe('function')
    expect(middleware.length).toBe(4)
  })

  it('should call next without anything if no error was passed', () => {
    const next = jest.fn()

    middleware(null, null, null, next)

    expect(next.mock.calls).toHaveLength(1)
    expect(next.mock.calls[0]).toHaveLength(0)
  })

  it('should send back a general error message', () => {
    const err = { message: 'general error' }
    const req = { method: 'POST', route: { path: '/' } }
    const status = jest.fn()
    const send = jest.fn()
    const res = {
      status (statusCode) {
        status(statusCode)
        return { send }
      }
    }
    const next = jest.fn()

    middleware(err, req, res, next)

    expect(status.mock.calls).toHaveLength(1)
    expect(status.mock.calls[0][0]).toBe(500)
    expect(send.mock.calls).toHaveLength(1)
    expect(send.mock.calls[0][0]).toEqual(err)
    expect(next.mock.calls).toHaveLength(1)
    expect(next.mock.calls[0][0].includes('ERR!')).toBe(true)
  })

  it('should send back a extended error message if mongoose validation error', () => {
    const err = {
      message: 'Validation failed',
      errors: {
        email: {
          message: 'Not unique'
        }
      }
    }
    const req = { method: 'POST', route: { path: '/' } }
    const status = jest.fn()
    const send = jest.fn()
    const res = {
      status (statusCode) {
        status(statusCode)
        return { send }
      }
    }
    const next = jest.fn()

    middleware(err, req, res, next)

    expect(status.mock.calls).toHaveLength(1)
    expect(status.mock.calls[0][0]).toBe(500)
    expect(send.mock.calls).toHaveLength(1)
    expect(send.mock.calls[0][0]).toEqual(err)
    expect(next.mock.calls).toHaveLength(1)
    expect(next.mock.calls[0][0].includes('ERR!')).toBe(true)
  })
})
