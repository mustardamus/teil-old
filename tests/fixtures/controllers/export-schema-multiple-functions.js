module.exports = {
  'GET /': [
    {
      body: {},
      querystring: {},
      params: {},
      response: {}
    },
    ({ next }) => {
      next()
    },
    ({ next }) => {
      next()
    },
    ({ reply }) => {
      reply.send({ success: true })
    }
  ]
}
