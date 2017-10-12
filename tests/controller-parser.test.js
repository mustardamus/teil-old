const { join } = require('path')
const controllerParser = require('../lib/controller-parser')

const fixDir = join(__dirname, 'fixtures/controllers')

describe('Controller Parser', () => {
  it('should throw an error if controller file does not exist', () => {
    return controllerParser('not-existent.js').catch(err => {
      expect(err.message).toBe("Controller 'not-existent.js' does not exist")
    })
  })

  it('should throw an error if controller does not export an object', () => {
    const path = join(fixDir, 'invalid-no-object.js')

    return controllerParser(path).catch(err => {
      expect(err.message.includes('must export an Object')).toBe(true)
    })
  })

  it('should throw an error if a route definition is invalid', () => {
    const path = join(fixDir, 'invalid-route-definition.js')

    return controllerParser(path).catch(err => {
      expect(err.message.includes('Invalid route definition')).toBe(true)
    })
  })

  it('should throw an error if invalid method', () => {
    const path = join(fixDir, 'invalid-method.js')

    return controllerParser(path).catch(err => {
      expect(err.message.includes('Invalid method')).toBe(true)
    })
  })

  it('should throw an error if no handler function was declared', () => {
    const path = join(fixDir, 'invalid-no-handler.js')

    return controllerParser(path).catch(err => {
      expect(err.message.includes('No handler function found')).toBe(true)
    })
  })

  it('should parse a exported single function', () => {
    const path = join(fixDir, 'export-single-function.js')

    return controllerParser(path).then(routes => {
      expect(Array.isArray(routes)).toBe(true)
      expect(routes.length).toBe(2)
      expect(routes[0].method).toBe('GET')
      expect(routes[0].url).toBe('/export-single-function')
      expect(typeof routes[0].handler).toBe('function')
      expect(routes[1].method).toBe('POST')
      expect(routes[1].url).toBe('/export-single-function/save')
      expect(typeof routes[1].handler).toBe('function')
    })
  })

  it('should parse multiple exported functions', () => {
    const path = join(fixDir, 'export-multiple-functions.js')

    return controllerParser(path).then(routes => {
      expect(routes.length).toBe(1)
      expect(typeof routes[0].handler).toBe('function')
      expect(Array.isArray(routes[0].beforeHandler)).toBe(true)
      expect(routes[0].beforeHandler.length).toBe(2)
    })
  })

  it('should parse the schema with a single exported function', () => {
    const path = join(fixDir, 'export-schema-single-function.js')

    return controllerParser(path).then(routes => {
      expect(routes.length).toBe(1)
      expect(typeof routes[0].handler).toBe('function')
      expect(routes[0].schema).toEqual({
        body: {},
        querystring: {},
        params: {},
        response: {}
      })
    })
  })

  it('should parse the schema with multiple exported functions', () => {
    const path = join(fixDir, 'export-schema-multiple-functions.js')

    return controllerParser(path).then(routes => {
      expect(routes.length).toBe(1)
      expect(typeof routes[0].handler).toBe('function')
      expect(Array.isArray(routes[0].beforeHandler)).toBe(true)
      expect(routes[0].beforeHandler.length).toBe(2)
      expect(routes[0].schema).toEqual({
        body: {},
        querystring: {},
        params: {},
        response: {}
      })
    })
  })

  it('should turn the /index route into /', () => {
    const path = join(fixDir, 'index.js')

    return controllerParser(path).then(routes => {
      expect(routes[0].url).toBe('/')
    })
  })
})
