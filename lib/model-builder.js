const mongoose = require('mongoose')
const modelParser = require('./model-parser')

module.exports = modelPath => {
  return new Promise((resolve, reject) => {
    modelParser(modelPath)
      .then(({
        name, schema, options, methods, statics, queries,
        virtuals
      }) => {
        const Schema = new mongoose.Schema(schema, options)

        methods.forEach(method => {
          Schema.methods[method.name] = method.fn
        })

        statics.forEach(statik => {
          Schema.statics[statik.name] = statik.fn
        })

        queries.forEach(query => {
          Schema.query[query.name] = query.fn
        })

        // virtuals.forEach()

        // TODO virtuals
        // TODO middleware

        const model = mongoose.model({ name }, Schema)
        resolve(model)
      })
      .catch(err => reject(err))
  })
}
