const { makeCleanUrl, isAllowedMethod } = require('../lib/helpers')

describe('Helpers', () => {
  it('should generate a clean url', () => {
    expect(makeCleanUrl('single')).toBe('/single')
    expect(makeCleanUrl('following/')).toBe('/following')
    expect(makeCleanUrl('/leading/following/')).toBe('/leading/following')
    expect(makeCleanUrl('/doubleslash//')).toBe('/doubleslash')
    expect(makeCleanUrl('/good')).toBe('/good')
    expect(makeCleanUrl('  total/madness//  ')).toBe('/total/madness')
  })

  it('should return if a method is allowed', () => {
    expect(isAllowedMethod('get')).toBe(true)
    expect(isAllowedMethod('POST')).toBe(true)
    expect(isAllowedMethod('nope')).toBe(false)
  })
})
