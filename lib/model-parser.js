const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const { Schema } = require('mongoose')
const validate = require('valib')
const {
  camelCase, kebabCase, isFunction, isObject, isArray, concat
} = require('lodash')

const funcsObjToArray = obj => {
  return Object.keys(obj)
    .filter(name => isFunction(obj[name]))
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
    if (!isArray(middleware.fn)) {
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
    const camelCaseName = camelCase(resourceName)
    const name = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1)
    let modelObj = {
      name: model.name || name,
      options: {},
      schema: {},
      methods: [],
      statics: [],
      query: [],
      virtual: [],
      middleware: []
    }

    if (model.options) {
      if (isObject(model.options)) {
        modelObj.options = model.options
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for options`)
        return reject(err)
      }
    }

    if (model.schema) {
      if (isFunction(model.schema)) {
        modelObj.schema = model.schema({ Types: Schema.Types, validate })
      } else if (isObject(model.schema)) {
        modelObj.schema = model.schema
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object or Function for schema`)
        return reject(err)
      }
    }

    if (model.methods) {
      if (isObject(model.methods)) {
        modelObj.methods = funcsObjToArray(model.methods)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for methods`)
        return reject(err)
      }
    }

    if (model.statics) {
      if (isObject(model.statics)) {
        modelObj.statics = funcsObjToArray(model.statics)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for statics`)
        return reject(err)
      }
    }

    if (model.query) {
      if (isObject(model.query)) {
        modelObj.query = funcsObjToArray(model.query)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for query`)
        return reject(err)
      }
    }

    if (model.virtual) {
      if (isObject(model.virtual)) {
        modelObj.virtual = Object.keys(model.virtual)
          .map(name => {
            const get = model.virtual[name].get
            const set = model.virtual[name].set

            if (!get && !set) {
              const err = new Error(`Model '${modelPath}' virtual field '${name}' must have a 'get' or/and 'set' method`)
              return reject(err)
            }

            if (get && !isFunction(get)) {
              const err = new Error(`Model '${modelPath}' virtual field '${name}' 'get' must be a function`)
              return reject(err)
            }

            if (set && !isFunction(set)) {
              const err = new Error(`Model '${modelPath}' virtual field '${name}' 'set' must be a function`)
              return reject(err)
            }

            return { name, get, set }
          })
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for virtual`)
        return reject(err)
      }
    }

    const middleware = model.middleware

    if (middleware) {
      if (isObject(middleware)) {
        let pre = []
        let post = []

        if (middleware.pre || middleware.post) {
          pre = getMiddlewareFromObject(middleware.pre, 'pre')
          post = getMiddlewareFromObject(middleware.post, 'post')
        } else {
          const obj = { pre: {}, post: {} }

          Object.keys(middleware).forEach(keyName => {
            const split = kebabCase(keyName).split('-')
            const hook = split[0]
            const name = split[1]

            obj[hook][name] = middleware[keyName]
          })

          pre = getMiddlewareFromObject(obj.pre, 'pre')
          post = getMiddlewareFromObject(obj.post, 'post')
        }

        modelObj.middleware = concat([], pre, post)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object for middleware`)
        return reject(err)
      }
    }

    resolve(modelObj)
  })
}
