module.exports = {
  'GET /': [
    {
      body (context) {
        return context
      }
    },
    ({ send }) => {
      send({ success: true })
    }
  ]
}
