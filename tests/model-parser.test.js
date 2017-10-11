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
      expect(err.message.includes('must export an Object for options')).toBe(true)
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
      expect(err.message.includes('must export an Object or Function for schema')).toBe(true)
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
      expect(typeof model.methods[1].fn).toBe('function')
    })
  })

  it('should throw an error if the methods does not export an object', () => {
    const path = join(fixDir, 'methods-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object for methods')).toBe(true)
    })
  })

  it('should set statics on the model as an array', () => {
    const path = join(fixDir, 'statics.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.statics)).toBe(true)
      expect(model.statics.length).toBe(2)
      expect(model.statics[0].name).toBe('first')
      expect(typeof model.statics[1].fn).toBe('function')
    })
  })

  it('should throw an error if the statics does not export an object', () => {
    const path = join(fixDir, 'statics-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object for statics')).toBe(true)
    })
  })

  it('should set query on the model as an array', () => {
    const path = join(fixDir, 'query.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.query)).toBe(true)
      expect(model.query.length).toBe(2)
      expect(model.query[0].name).toBe('first')
      expect(typeof model.query[1].fn).toBe('function')
    })
  })

  it('should throw an error if the query does not export an object', () => {
    const path = join(fixDir, 'query-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object for query')).toBe(true)
    })
  })

  it('should set virtual on the model as an array', () => {
    const path = join(fixDir, 'virtual.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.virtual)).toBe(true)
      expect(model.virtual.length).toBe(2)
      expect(model.virtual[0].name).toBe('first')
      expect(typeof model.virtual[0].get).toBe('function')
      expect(typeof model.virtual[1].set).toBe('function')
    })
  })

  it('should throw an error if the virtual does not export an object', () => {
    const path = join(fixDir, 'virtual-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object for virtual')).toBe(true)
    })
  })

  it('should throw an error if a virtual field does not export a get or set function', () => {
    const path = join(fixDir, 'virtual-invalid-get-set.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes(`must have a 'get' or/and 'set' method`)).toBe(true)
    })
  })

  it('should throw an error if a virtual field does not export a get as function', () => {
    const path = join(fixDir, 'virtual-invalid-get.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes(`'get' must be a function`)).toBe(true)
    })
  })

  it('should throw an error if a virtual field does not export a set as function', () => {
    const path = join(fixDir, 'virtual-invalid-set.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes(`'set' must be a function`)).toBe(true)
    })
  })

  it('should set middleware as an array from an object', () => {
    const path = join(fixDir, 'middleware-pre-post-object.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.middleware)).toBe(true)
      expect(model.middleware.length).toBe(4)
      expect(model.middleware[0].hook).toBe('pre')
      expect(model.middleware[1].name).toBe('save')
      expect(model.middleware[2].hook).toBe('post')
      expect(typeof model.middleware[3].fn).toBe('function')
    })
  })

  it('should set middleware as an array from an object of an array of functions', () => {
    const path = join(fixDir, 'middleware-pre-post-object-array.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.middleware)).toBe(true)
      expect(model.middleware.length).toBe(3)
      expect(model.middleware[0].hook).toBe('pre')
      expect(model.middleware[1].name).toBe('save')
      expect(model.middleware[2].name).toBe('save')
    })
  })

  it('should set middleware as an array from an object with the key names as hook names', () => {
    const path = join(fixDir, 'middleware-pre-post-keys.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.middleware)).toBe(true)
      expect(model.middleware.length).toBe(2)
      expect(model.middleware[0].hook).toBe('pre')
      expect(model.middleware[0].name).toBe('init')
      expect(model.middleware[1].hook).toBe('post')
      expect(model.middleware[1].name).toBe('save')
    })
  })

  it('should set middleware as an array from an object with the key names as hook names of an array of functions', () => {
    const path = join(fixDir, 'middleware-pre-post-keys-array.js')

    return modelParser(path).then(model => {
      expect(Array.isArray(model.middleware)).toBe(true)
      expect(model.middleware.length).toBe(3)
      expect(model.middleware[0].hook).toBe('pre')
      expect(model.middleware[0].name).toBe('init')
      expect(model.middleware[1].hook).toBe('post')
      expect(model.middleware[1].name).toBe('save')
      expect(model.middleware[2].hook).toBe('post')
      expect(model.middleware[2].name).toBe('save')
      expect(typeof model.middleware[2].fn).toBe('function')
    })
  })

  it('should throw an error if a middleware field does not export a set as function', () => {
    const path = join(fixDir, 'middleware-invalid.js')

    return modelParser(path).catch(err => {
      expect(err.message.includes('must export an Object for middleware')).toBe(true)
    })
  })
})
