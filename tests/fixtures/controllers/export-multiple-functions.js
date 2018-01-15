module.exports = {
  'GET /': [
    (request, response, next) => {
      next()
    },
    (request, response, next) => {
      next()
    },
    (request, response) => {
      response.send({ success: true })
    }
  ]
}
