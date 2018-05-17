module.exports = (req, res, next) => {
  // TODO also let middlewares take the extended context
  console.log('Global middleware applied to every route', req.path)
  next()
}
