const modelsObj = require('./models-object')

module.exports = handler => {
  const orgHandler = handler.bind({})

  return async (request, reply, next) => {
    const models = await modelsObj() // todo only in dev, sonst cached

    if (orgHandler.length === 1) {
      return orgHandler({ request, reply, next, models })
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
