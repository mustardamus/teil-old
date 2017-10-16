const { isFunction } = require('lodash')
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

          const log = context.request.log

          if (isFunction(log)) {
            context.log = log.bind(context.request)
          }
        }

        if (context.reply) {
          const send = context.reply.send
          const redirect = context.reply.redirect

          if (isFunction(send)) {
            context.send = send.bind(context.reply)
          }

          if (isFunction(redirect)) {
            context.redirect = redirect.bind(context.reply)
          }
        }

        resolve(context)
      })
      .catch(err => reject(err))
  })
}
