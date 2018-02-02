const middlewareLoad = require('./middleware-load')

module.exports = async (app, options = {}) => {
  const { stack } = app._router
  const queryLayer = stack.shift()
  const expressInitLayer = stack.shift()
  const routerLayer = stack.pop()
  app._router.stack = [queryLayer, expressInitLayer]

  await middlewareLoad(app, options, 'Updated')
  app._router.stack.push(routerLayer)
}
