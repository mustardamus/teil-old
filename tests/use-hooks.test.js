const { join } = require('path')
const useHooks = require('../lib/use-hooks')

const fixDir = join(__dirname, 'fixtures/hooks')

describe('Use Hooks', () => {
  it('should add a exported single function hook', () => {
    const app = { addHook: jest.fn() }
    const hooks = useHooks(app, {
      hooksGlob: join(fixDir, 'on-request-valid-single-function.js')
    })

    expect(hooks).toEqual([
      { hookName: 'onRequest', name: 'valid-single-function' }
    ])
    expect(app.addHook.mock.calls.length).toBe(1)
    expect(app.addHook.mock.calls[0][0]).toBe('onRequest')
    expect(typeof app.addHook.mock.calls[0][1]).toBe('function')
  })

  it('should throw an error if a unsupported hook name is used', () => {
    const app = { addHook: jest.fn() }
    const opt = {
      hooksGlob: join(fixDir, 'unknown-hook-name-invalid.js')
    }

    expect(() => useHooks(app, opt)).toThrow()
  })

  it('should throw an error if no function is exported', () => {
    const app = { addHook: jest.fn() }
    const opt = {
      hooksGlob: join(fixDir, 'on-response-invalid-export.js')
    }

    expect(() => useHooks(app, opt)).toThrow()
  })

  it('should throw an error on wrong arguments count', () => {
    const app = { addHook: jest.fn() }
    const opt = {
      hooksGlob: join(fixDir, 'on-send-invalid-arguments.js')
    }

    expect(() => useHooks(app, opt)).toThrow()
  })
})
