const {
  makeCleanUrl, isAllowedMethod, objectToCliArgs, removeCwd
} = require('../lib/helpers')

describe('Helpers', () => {
  it('should generate a clean url', () => {
    expect(makeCleanUrl('single')).toBe('/single')
    expect(makeCleanUrl('following/')).toBe('/following')
    expect(makeCleanUrl('/leading/following/')).toBe('/leading/following')
    expect(makeCleanUrl('/doubleslash//')).toBe('/doubleslash')
    expect(makeCleanUrl('/good')).toBe('/good')
    expect(makeCleanUrl('  total/madness//  ')).toBe('/total/madness')
    expect(makeCleanUrl('/')).toBe('/')
  })

  it('should return if a method is allowed', () => {
    expect(isAllowedMethod('get')).toBe(true)
    expect(isAllowedMethod('POST')).toBe(true)
    expect(isAllowedMethod('nope')).toBe(false)
  })

  it('should turn an object into cli arguments', () => {
    const cli = objectToCliArgs({
      dbpath: './db',
      logpath: './db/mongod.log',
      logappend: true,
      fork: true
    })

    expect(cli).toBe('--dbpath "./db" --logpath "./db/mongod.log" --logappend --fork')
  })

  it('should clear strings of the current working directory', () => {
    const fullPath = `${process.cwd()}/controllers`

    expect(removeCwd(fullPath)).toBe('./controllers')
    expect(removeCwd('./already/clear')).toBe('./already/clear')
  })
})
