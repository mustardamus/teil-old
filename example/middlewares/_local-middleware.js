module.exports = (req, res, next) => {
  console.log('Local middleware applied to specific routes', req.path)
  next()
}
