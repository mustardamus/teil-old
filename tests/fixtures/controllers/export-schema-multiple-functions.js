module.exports = {
  'GET /': [
    {
      body: {},
      querystring: {},
      params: {},
      response: {}
    },
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
