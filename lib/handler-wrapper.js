const { join } = require('path')
const modelsObj = require('./models-object')

const modelsGlob = join(process.cwd(), 'models/*.js')

module.exports = handler => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    if (orgHandler.length === 1) {
      return modelsObj(modelsGlob)
        .then(models => {
          const context = { request, reply, next, models }

          // TODO test that part by exporting a function that accepts options (models)
          Object.keys(models).forEach(modelName => {
            context[modelName] = models[modelName]
          })

          orgHandler(context)
        })
        .catch(err => console.log(err))
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
