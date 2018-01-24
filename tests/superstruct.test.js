const { struct } = require('../lib/superstruct')

describe('Custom Superstruct', () => {
  it('should validate a ObjectId', () => {
    const valid = { test: '5a66122b37e9861604b84493' }
    const invalid = { test: 'nope' }

    expect(struct({ test: 'isMongoId' }).test(valid)).toBe(true)
    expect(struct({ test: 'isMongoId' }).test(invalid)).toBe(false)
  })

  it('should check if a string is not empty', () => {
    const valid = { test: 'yes' }
    const invalid = { test: '' }

    expect(struct({ test: 'isNotEmpty' }).test(valid)).toBe(true)
    expect(struct({ test: 'isNotEmpty' }).test(invalid)).toBe(false)
  })
})
