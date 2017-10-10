const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const { camelCase, isFunction, isObject } = require('lodash')
const { Schema } = require('mongoose')
const validate = require('valib')

const funcsObjToArray = obj => {
  return Object.keys(obj)
    .filter(name => isFunction(obj[name]))
    .map(name => {
      return { name, fn: obj[name] }
    })
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
      virtual: []
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

    resolve(modelObj)
  })
}
