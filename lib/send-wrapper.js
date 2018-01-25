const { isObject, isFunction } = require('lodash')
const _ = require('lodash')
const validator = require('validator')
const { struct, superstruct } = require('./superstruct')

module.exports = (context, options = {}) => {
  const schema = context.schema || {}
  const resSchema = schema.response

  return (data = {}) => {
    if (isFunction(data.toObject)) {
      data = data.toObject()
    }

    if (isFunction(resSchema)) {
      const schemaContext = {
        data,
        req: context.req,
        res: context.res,
        struct,
        superstruct,
        _,
        validator
      }

      data = resSchema(schemaContext)
    } else if (isObject(resSchema)) {
      struct(resSchema)(data)
    }

    return context.res.send(data)
  }
}
