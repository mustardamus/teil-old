module.exports = {
  'GET /': [
    {
      body: {},
      querystring: {},
      params: {},
      response: {}
    },
    ({ reply }) => {
      reply.send({ success: true })
    }
  ]
}
