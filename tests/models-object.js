const { join } = require('path')
const modelsObject = require('../lib/models-object')

const fixDir = join(__dirname, 'fixtures/models/full')

describe('Models Object', () => {
  it('should return an object of compiled models from a folder', () => {
    return modelsObject(fixDir)
      .then(models => {
        expect(models === Object(models)).toBe(false)
      })
  })
})
