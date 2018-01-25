const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const { Schema } = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

const funcsObjToArray = obj => {
  return Object.keys(obj)
    .filter(name => _.isFunction(obj[name]))
    .map(name => {
      return { name, fn: obj[name] }
    })
}

const getMiddlewareFromObject = (obj = {}, hookName) => {
  const allowedNames = [
    'init', 'validate', 'save', 'remove', 'count', 'find', 'findOne',
    'findOneAndRemove', 'findOneAndUpdate', 'update', 'insertMany'
  ]

  const retArr = []
  const middlewares = Object.keys(obj)
    .filter(name => allowedNames.includes(name))
    .map(name => {
      return { hook: hookName, name, fn: obj[name] }
    })

  middlewares.forEach(middleware => {
    if (!_.isArray(middleware.fn)) {
      retArr.push(middleware)
    } else {
      middleware.fn.forEach(fn => {
        retArr.push({ hook: middleware.hook, name: middleware.name, fn })
      })
    }
  })

  return retArr
}

module.exports = modelPath => {
  return new Promise((resolve, reject) => {
    if (!existsSync(modelPath)) {
      const err = new Error(`Model '${modelPath}' does not exist`)
      return reject(err)
    }

    const model = importFresh(modelPath)

    if (model !== Object(model)) {
      const err = new Error(`Model '${modelPath}' must export an Object`)
      return reject(err)
    }

    const resourceName = basename(modelPath, '.js')
    const camelCaseName = _.camelCase(resourceName)
    const name = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1)
    const modelObj = {
      name: model.name || name,
      options: {},
      schema: {},
      methods: [],
      statics: [],
      queries: [],
      virtuals: [],
      middlewares: []
    }
    const {
      options, schema, methods, statics, queries, virtuals, middlewares
    } = model

    if (options) {
      if (_.isObject(options)) {
        // TODO default options set via config file

        modelObj.options = options
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for options`)
        return reject(err)
      }
    }

    if (schema) {
      if (_.isFunction(schema)) {
        modelObj.schema = schema({ Types: Schema.Types, validator, _ })
      } else if (_.isObject(schema)) {
        modelObj.schema = schema
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object or Function for schema`)
        return reject(err)
      }
    }

    if (methods) {
      if (_.isObject(methods)) {
        modelObj.methods = funcsObjToArray(methods)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for methods`)
        return reject(err)
      }
    }

    if (statics) {
      if (_.isObject(statics)) {
        modelObj.statics = funcsObjToArray(statics)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for statics`)
        return reject(err)
      }
    }

    if (queries) {
      if (_.isObject(queries)) {
        modelObj.queries = funcsObjToArray(queries)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for queries`)
        return reject(err)
      }
    }

    if (virtuals) {
      if (_.isObject(virtuals)) {
        modelObj.virtuals = Object.keys(virtuals)
          .map(name => {
            const virtual = virtuals[name]

            if (virtual.ref) { // for virtual population
              return { ...virtual, name }
            }

            const { get, set } = virtual

            if (!get && !set) {
              // TODO support virtual populated fields: http://thecodebarbarian.com/mongoose-virtual-populate
              const err = new Error(`Model '${modelPath}' virtuals field '${name}' must have a 'get' or/and 'set' method`)
              return reject(err)
            }

            if (get && !_.isFunction(get)) {
              const err = new Error(`Model '${modelPath}' virtuals field '${name}' 'get' must be a function`)
              return reject(err)
            }

            if (set && !_.isFunction(set)) {
              const err = new Error(`Model '${modelPath}' virtuals field '${name}' 'set' must be a function`)
              return reject(err)
            }

            return { name, get, set }
          })
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for virtuals`)
        return reject(err)
      }
    }

    if (middlewares) {
      if (_.isObject(middlewares)) {
        let pre = []
        let post = []

        if (middlewares.pre || middlewares.post) {
          pre = getMiddlewareFromObject(middlewares.pre, 'pre')
          post = getMiddlewareFromObject(middlewares.post, 'post')
        } else {
          const obj = { pre: {}, post: {} }

          Object.keys(middlewares).forEach(keyName => {
            const split = _.kebabCase(keyName).split('-')
            const hook = split[0]
            const name = split[1]

            obj[hook][name] = middlewares[keyName]
          })

          pre = getMiddlewareFromObject(obj.pre, 'pre')
          post = getMiddlewareFromObject(obj.post, 'post')
        }

        modelObj.middlewares = _.concat([], pre, post)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for middlewares`)
        return reject(err)
      }
    }

    resolve(modelObj)
  })
}
