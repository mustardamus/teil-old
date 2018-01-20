const middlewareErrorHandling = require('../lib/middleware-error-handling')

describe('Middleware Error Handling', () => {
  it('should export a error handling middleware function', () => {
    const middleware = middlewareErrorHandling()

    expect(typeof middleware).toBe('function')
    expect(middleware.length).toBe(4)
  })
})
