const { join } = require('path')
const modelsObj = require('./models-object')

const modelsGlob = join(process.cwd(), 'models/*.js')

module.exports = (context = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    modelsObj(modelsGlob)
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
