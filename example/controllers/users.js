module.exports = {
  'GET /' ({ reply, User }) {
    const user1 = new User({ name: 'user1' })
    const user2 = new User({ name: 'user2' })

    reply.send([ user1, user2 ])
  }
}
