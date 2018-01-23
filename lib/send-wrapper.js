const { isObject, isFunction } = require('lodash')
const { struct } = require('./superstruct')

module.exports = (context, options = {}) => {
  const schema = context.schema || {}

  return (data = {}) => {
    if (isFunction(data.toObject)) {
      data = data.toObject()
    }

    if (isObject(schema.response)) {
      struct(schema.response)(data)
    }

    return context.res.send(data)
  }

  // check for schema.response
  // if its an object, check with superstruct
  // if its a function, execute it and pass returned data to orig send
  // pass in same context as in other validation functions
}
