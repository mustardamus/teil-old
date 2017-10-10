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
      methods: {}
    }

    if (model.options) {
      if (isObject(model.options)) {
        modelObj.options = model.options
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object as options`)
        return reject(err)
      }
    }

    if (model.schema) {
      if (isFunction(model.schema)) {
        modelObj.schema = model.schema({ Types: Schema.Types, validate })
      } else if (isObject(model.schema)) {
        modelObj.schema = model.schema
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object or Function as schema`)
        return reject(err)
      }
    }

    if (model.methods) {
      if (isObject(model.methods)) {
        modelObj.methods = funcsObjToArray(model.methods)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object as methods`)
        return reject(err)
      }
    }

    if (model.statics) {
      if (isObject(model.statics)) {
        modelObj.statics = funcsObjToArray(model.statics)
      } else {
        const err = new Error(`Model '${modelPath}' must export an Object as statics`)
        return reject(err)
      }
    }

    resolve(modelObj)
  })
}
