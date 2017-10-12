const { join } = require('path')
const modelsObj = require('./models-object')

const modelsGlob = join(process.cwd(), 'models/*.js')

module.exports = handler => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    if (orgHandler.length === 1) {
      return modelsObj(modelsGlob)
        .then(models => {
          orgHandler({ request, reply, next, models })
        })
        .catch(err => console.log(err))
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
