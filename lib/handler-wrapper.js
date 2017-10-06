module.exports = handler => {
  const orgHandler = handler.bind({})

  return (request, reply, next) => {
    return orgHandler({ request, reply, next })
  }
}
