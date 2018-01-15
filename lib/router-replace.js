module.exports = (app, router, options = {}) => {
  app._router.stack.forEach(route => {
    if (route.name === 'router' && route.regexp.test(options.apiEndpoint)) {
      route.handle = router
    }
  })
}
