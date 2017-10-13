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

        resolve(context)
      })
      .catch(err => reject(err))
  })
}
