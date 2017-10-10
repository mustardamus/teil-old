const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const { camelCase, isFunction, isObject } = require('lodash')
const { Schema } = require('mongoose')
const validate = require('valib')

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
      schema: {}
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

    resolve(modelObj)
  })
}
