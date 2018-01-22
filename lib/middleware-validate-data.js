const _ = require('lodash')
const validator = require('validator')
const { struct, superstruct } = require('./superstruct')

const validate = ({ schema, name, req, res, next }) => {
  const data = req[name] || {}

  if (_.isFunction(schema)) {
    schema({
      data,
      req,
      res,
      next,
      struct,
      superstruct,
      _,
      validator
    }) // cutsom error throwing
  } else if (_.isObject(schema)) {
    struct(schema)(data) // will throw an error if invalid
  } else {
    throw new Error(`Schema '${name}' must be an object or a function`)
  }
}

module.exports = ({ schema }, options = {}) => {
  const { body, params, query } = schema

  return (req, res, next) => {
    if (body) {
      validate({ schema: body, name: 'body', req, res, next })
    }

    if (params) {
      validate({ schema: params, name: 'params', req, res, next })
    }

    if (query) {
      validate({ schema: query, name: 'query', req, res, next })
    }

    next()
  }
}
