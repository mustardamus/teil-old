module.exports = {
  'GET /': [
    (request, reply, next) => {
      next()
    },
    (request, reply, next) => {
      next()
    },
    (request, reply) => {
      reply.send({ success: true })
    }
  ]
}
