module.exports = (req, res, next) => {
  console.log('onRequest Hook Headers Log:', req.headers)
  next()
}
