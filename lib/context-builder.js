const modelsObj = require('./models-object')
const options = require('../example/teil.config')

module.exports = (context = {}) => {
  return new Promise((resolve, reject) => {
    modelsObj(options.modelsGlob)
      .then(models => {
        context.models = context.models || models

        Object.keys(context.models).forEach(modelName => {
          context[modelName] = context.models[modelName]
        })

        resolve(context)
      })
      .catch(err => reject(err))
  })
}
