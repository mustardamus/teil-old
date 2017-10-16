const modelsObj = require('./models-object')

module.exports = (context = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    const keys = []
    const promises = []

    if (!context.models && options.modelsGlob) {
      keys.push('models')
      promises.push(modelsObj(options.modelsGlob))
    }

    Promise.all(promises)
      .then(results => {
        keys.forEach((keyName, i) => {
          context[keyName] = results[i]
        })

        if (context.models) {
          Object.keys(context.models).forEach(modelName => {
            context[modelName] = context.models[modelName]
          })
        }

        if (context.request) {
          context.query = context.request.query
          context.body = context.request.body
          context.params = context.request.params
          context.headers = context.request.headers
          // context.log = context.request.log.bind(context.request)
          // log disabled by default, check if function exists before extending context
        }

        if (context.reply) {
          context.send = context.reply.send.bind(context.reply)
          context.redirect = context.reply.redirect.bind(context.reply)
        }

        resolve(context)
      })
      .catch(err => reject(err))
  })
}
