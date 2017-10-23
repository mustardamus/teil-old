module.exports = {
  'GET /' ({ Post, send }) {
    Post.find().exec()
      .then(users => send(users))
      .catch(err => send(err))
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Post, reply, send, params }) => {
      Post.findById(params.id).exec()
        .then(post => {
          if (!post) {
            reply.code(404).send(new Error('Post not found'))
          } else {
            send(post)
          }
        })
        .catch(err => send(err))
    }
  ],

  'POST /': [
    {
      body: {
        title: 'string',
        content: 'string'
      }
    },
    ({ Post, body, send }) => {
      const post = new Post(body)

      post.save()
        .then(() => send(post))
        .catch(err => send(err))
    }
  ],

  'PUT /:id': [
    {
      params: {
        id: 'string'
      },
      body: {
        title: 'string',
        content: 'string'
      }
    },
    ({ Post, send, params, body }) => {
      Post.findByIdAndUpdate(params.id, { $set: body }, { new: true })
        .then(post => send(post))
        .catch(err => send(err))
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Post, send, params }) => {
      Post.findByIdAndRemove(params.id)
        .then(user => send({ success: true }))
        .catch(err => send(err))
    }
  ]
}
