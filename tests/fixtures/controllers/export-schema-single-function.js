module.exports = {
  'GET /': [
    {
      body: {},
      querystring: {},
      params: {},
      response: {}
    },
    (request, reply) => {
      reply.send({ success: true })
    }
  ]
}
