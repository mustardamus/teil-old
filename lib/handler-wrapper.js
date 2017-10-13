const contextBuilder = require('./context-builder')

module.exports = (handler, options = {}) => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    if (orgHandler.length === 1) {
      return contextBuilder({ request, reply, next }, options)
        .then(context => orgHandler(context))
        .catch(err => console.log(err))
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
