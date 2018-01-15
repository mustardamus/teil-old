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
    ({ send }) => {
      send({ success: true })
    }
  ]
}
