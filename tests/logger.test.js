const logger = require('../lib/logger')

const log = logger()

describe('Logger', () => {
  it('should export the needed methods', () => {
    expect(typeof log.info).toBe('function')
    expect(typeof log.error).toBe('function')
    expect(typeof log.warn).toBe('function')
  })
})
