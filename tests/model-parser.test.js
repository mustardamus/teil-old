const { join } = require('path')
const { Schema } = require('mongoose')
const { isObject } = require('lodash')
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

  it('should set the name of the model based on the filename', () => {
    const path = join(fixDir, 'name-from-filename.js')

    return modelParser(path).then(model => {
      expect(model.name).toBe('NameFromFilename')
    })
  })

  it('should overwrite the name of the model if set', () => {
    const path = join(fixDir, 'name-overwrite.js')

    return modelParser(path).then(model => {
      expect(model.name).toBe('NameOverwrite')
    })
  })

  it('should set the options of the model given by an object', () => {
    const path = join(fixDir, 'options.js')

    return modelParser(path).then(model => {
      expect(isObject(model.options)).toBe(true)
      expect(model.options).toEqual(require(path).options)
    })
  })

  it('should throw an error if the options does not export an object', () => {
    const path = join(fixDir, 'options-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object as options')).toBe(true)
    })
  })

  it('should set the schema of the model given by an object', () => {
    const path = join(fixDir, 'schema-object.js')

    return modelParser(path).then(model => {
      expect(isObject(model.schema)).toBe(true)
      expect(model.schema).toEqual(require(path).schema)
    })
  })

  it('should set the schema of the model given by an function', () => {
    const path = join(fixDir, 'schema-function.js')

    return modelParser(path).then(model => {
      expect(isObject(model.schema)).toBe(true)
      expect(model.schema.name).toBe(String)
      expect(model.schema.userId).toBe(Schema.Types.ObjectId)
      expect(model.schema.meta).toBe(Schema.Types.Mixed)
    })
  })

  it('should throw an error if the schema does not export an object or function', () => {
    const path = join(fixDir, 'schema-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object or Function as schema')).toBe(true)
    })
  })

  it('should have access to custom validations in the schema', () => {
    const path = join(fixDir, 'schema-custom-validation.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.schema.email.validate)).toBe(true)
      expect(typeof model.schema.email.validate[0]).toBe('function')
      expect(model.schema.email.validate[0]('some@mail.com')).toBe(true)

      expect(typeof model.schema.url.validate).toBe('object')
      expect(typeof model.schema.url.validate.validator).toBe('function')
      expect(model.schema.url.validate.validator('http://some.com')).toBe(true)
    })
  })

  it('should set methods on the model as an array', () => {
    const path = join(fixDir, 'methods.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.methods)).toBe(true)
      expect(model.methods.length).toBe(2)
      expect(model.methods[0].name).toBe('first')
      expect(typeof model.methods[1].cb).toBe('function')
    })
  })

  it('should throw an error if the methods does not export an object', () => {
    const path = join(fixDir, 'methods-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object as methods')).toBe(true)
    })
  })

  it('should have statics')
  it('should have query helpers')
  it('should have virtuals')
})
