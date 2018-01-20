module.exports = {
  'GET /': [
    {
      body: {},
      query: {},
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
