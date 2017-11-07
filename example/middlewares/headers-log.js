// const log = require('teil/log') // will load the logger instance with options

module.exports = (req, res, next) => {
  console.log('Headers Log Middleware:', req.headers)
  next()
}
