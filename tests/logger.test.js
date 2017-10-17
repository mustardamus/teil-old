const logger = require('../lib/logger')

const log = logger({ logger: {
  level: 'info'
}})

describe('Logger', () => {
  it('should export the needed methods', () => {
    expect(typeof log.info).toBe('function')
    expect(typeof log.error).toBe('function')
    expect(typeof log.debug).toBe('function')
    expect(typeof log.fatal).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.trace).toBe('function')
    expect(typeof log.child).toBe('function')
  })
})
