const { existsSync } = require('fs')
const { basename } = require('path')
const importFresh = require('import-fresh')
const pluralize = require('pluralize')

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

    const resourceNameSingular = basename(modelPath, '.js')
    const resourceNamePlural = pluralize(resourceNameSingular)
    let mapperObj = {
      name: model.name || resourceNameSingular,
      table: model.table || resourceNamePlural
    }
    let schema = {
      $schema: 'http://json-schema.org/draft-06/schema#',
      type: 'object',
      properties: {},
      required: []
    }

    if (model.schema) {
      // TODO auto schema name and description

      if (model.schema.properties) {
        Object.assign(schema, model.schema)
      } else {
        if (model.schema.required) {
          Object.assign(schema.required, model.schema.required)
          delete model.schema.required
        }

        Object.assign(schema.properties, model.schema)
      }

      mapperObj.schema = schema
    }

    if (model.relations) {
      // TODO
    }

    resolve(mapperObj)
  })
}
