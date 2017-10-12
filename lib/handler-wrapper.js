const modelsObj = require('./models-object')

module.exports = handler => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    if (orgHandler.length === 1) {
      return modelsObj()
        .then(models => {
          orgHandler({ request, reply, next, models })
        })
        .catch(err => console.log(err))
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
