const { join } = require('path')
const { isArray, isFunction } = require('lodash')
const middlewareParser = require('../lib/middleware-parser')

const fixDir = join(__dirname, 'fixtures/middlewares')

describe('Middleware Parser', () => {
  it('should parse a single function', () => {
    const middlewarePath = join(fixDir, 'valid-single-function.js')

    return middlewareParser(middlewarePath).then(middlewares => {
      expect(isArray(middlewares)).toBe(true)
      expect(middlewares.length).toBe(1)
      expect(isFunction(middlewares[0])).toBe(true)
    })
  })

  it('should parse a array of functions', () => {
    const middlewarePath = join(fixDir, 'valid-multi-functions.js')

    return middlewareParser(middlewarePath).then(middlewares => {
      expect(isArray(middlewares)).toBe(true)
      expect(middlewares.length).toBe(2)
      expect(isFunction(middlewares[0])).toBe(true)
      expect(isFunction(middlewares[1])).toBe(true)
    })
  })

  it('should reject on a invalid export', () => {
    const middlewarePath = join(fixDir, 'invalid-export.js')

    return middlewareParser(middlewarePath).catch(err => {
      expect(err.message.includes('must export a single function or an array of functions')).toBe(true)
    })
  })

  it('should reject on a wrong argument count on a function', () => {
    const middlewarePath = join(fixDir, 'invalid-arguments.js')

    return middlewareParser(middlewarePath).catch(err => {
      expect(err.message.includes(`must have three arguments: 'req', 'res' and 'next'`)).toBe(true)
    })
  })

  it('should reject on a invalid export in an array', () => {
    const middlewarePath = join(fixDir, 'invalid-export-array.js')

    return middlewareParser(middlewarePath).catch(err => {
      expect(err.message.includes('must export an array of functions')).toBe(true)
    })
  })
})
