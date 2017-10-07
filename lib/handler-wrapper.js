module.exports = handler => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    if (orgHandler.length === 1) {
      return orgHandler({ request, reply, next })
    } else {
      return orgHandler(request, reply, next)
    }
  }
}
