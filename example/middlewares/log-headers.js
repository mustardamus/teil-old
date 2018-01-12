// const log = require('teil/log') // will load the logger instance with options

module.exports = (req, res, next) => {
  // console.log('Middleware Headers Log:', req.headers)
  next()
}
