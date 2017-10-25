module.exports = {
  'GET /' ({ User, send, log }) {
    let obj = { onh: 'from url', mehr: 'so auch' }
    obj.obj = { forr: 'baaar ' }
    obj.yooo = obj

    log.info(obj)
    User.find().exec()
      .then(users => send(users))
      .catch(err => send(err))
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ User, reply, send, params }) => {
      User.findById(params.id).exec()
        .then(user => {
          if (!user) {
            reply.code(404).send(new Error('User not found'))
          } else {
            send(user)
          }
        })
        .catch(err => send(err))
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

      user.save()
        .then(() => send(user))
        .catch(err => send(err))
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
      User.findByIdAndUpdate(params.id, { $set: body }, { new: true })
        .then(user => send(user))
        .catch(err => send(err))
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ User, send, params }) => {
      User.findByIdAndRemove(params.id)
        .then(user => send({ success: true }))
        .catch(err => send(err))
    }
  ]
}
