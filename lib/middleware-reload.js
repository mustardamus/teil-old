const middlewareLoad = require('./middleware-load')

module.exports = async (app, options = {}) => {
  const { stack } = app._router
  const queryLayer = stack.shift()
  const expressInitLayer = stack.shift()
  const routerLayer = stack.pop()
  app._router.stack = [queryLayer, expressInitLayer]
  const loaded = await middlewareLoad(app, options)

  app._router.stack.push(routerLayer)

  return loaded
}
