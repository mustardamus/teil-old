module.exports = {
  'GET /' ({ reply }) {
    reply.send({ route: 'index' })
  }
}
