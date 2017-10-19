module.exports = {
  'GET /' ({ User, send }) {
    User.find().exec()
      .then(users => send(users))
      .catch(err => console.log('err', err))
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ User, send, params }) => {
      User.findById(params.id).exec()
        .then(user => send(user))
        .catch(err => console.log('err', err))
    }
  ],

  'POST /': [
    {
      body: {
        username: 'string',
        password: 'string'
      }
    },
    ({ User, body, send }) => {
      const user = new User(body)
      user.save().then(() => send(user))
    }
  ],

  'PUT /:id': [
    {
      params: {
        id: 'string'
      },
      body: {
        name: 'string'
      }
    },
    ({ User, send, params, body }) => {
      User.findById(params.id).then(user => {
        // use find by and update method
        user.name = body.name

        user.save().then(() => send(user))
      })
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ User, send, params }) => {
      User.findById(params.id).then(user => {
        // use find by and delete method
        user.remove().then(() => send(user))
      })
    }
  ]
}
