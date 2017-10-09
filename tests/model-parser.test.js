const { join } = require('path')
const modelParser = require('../lib/model-parser')

const fixDir = join(__dirname, 'fixtures/models')

describe('Model Parser', () => {
  it('should throw an error if model file does not exist', () => {
    return modelParser('not-existent.js').catch(err => {
      expect(err.message).toBe("Model 'not-existent.js' does not exist")
    })
  })

  it('should throw an error if the model does not export an object', () => {
    const path = join(fixDir, 'invalid-no-object.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object')).toBe(true)
    })
  })

  it('should set the name and table of the model based on the filename', () => {
    const path = join(fixDir, 'name-table.js')

    return modelParser(path).then(model => {
      expect(model.name).toBe('name-table')
      expect(model.table).toBe('name-tables')
    })
  })

  it('should overwrite the name and table of the model', () => {
    const path = join(fixDir, 'name-table-overwrite.js')

    return modelParser(path).then(model => {
      expect(model.name).toBe('over')
      expect(model.table).toBe('overs')
    })
  })

  it('should export a given full schema', () => {
    const path = join(fixDir, 'full-schema.js')

    return modelParser(path).then(model => {
      expect(model.schema).toEqual({
        $schema: 'http://json-schema.org/draft-06/schema#',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        },
        required: ['id']
      })
    })
  })

  it('should export a given simplified schema', () => {
    const path = join(fixDir, 'simple-schema.js')

    return modelParser(path).then(model => {
      expect(model.schema).toEqual({
        $schema: 'http://json-schema.org/draft-06/schema#',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        },
        required: ['id']
      })
    })
  })
})
