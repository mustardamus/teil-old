module.exports = (app, router, options = {}) => {
  app._router.stack.forEach(route => {
    if (route.name === 'router' && route.regexp.test('/api')) { // TODO api endpoint option
      route.handle = router
    }
  })
}
