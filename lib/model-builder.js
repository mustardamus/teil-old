const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const modelParser = require('./model-parser')

module.exports = modelPath => {
  return new Promise((resolve, reject) => {
    modelParser(modelPath)
      .then(({
        name, schema, options, methods, statics,
        queries, virtuals, middlewares
      }) => {
        const Schema = new mongoose.Schema(schema, options)

        Schema.plugin(beautifyUnique)

        methods.forEach(method => {
          Schema.methods[method.name] = method.fn
        })

        statics.forEach(statik => {
          Schema.statics[statik.name] = statik.fn
        })

        queries.forEach(query => {
          Schema.query[query.name] = query.fn
        })

        virtuals.forEach(virtual => {
          if (virtual.ref) {
            Schema.virtual(virtual.name, virtual)
          } else {
            Schema.virtual(virtual.name)
              .get(virtual.get)
              .set(virtual.set)
          }
        })

        middlewares.forEach(middleware => {
          Schema[middleware.hook](middleware.name, middleware.fn)
        })

        delete mongoose.models[name]
        delete mongoose.modelSchemas[name]

        const model = mongoose.model(name, Schema)
        resolve(model)
      })
      .catch(err => reject(err))
  })
}
