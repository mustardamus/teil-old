module.exports = {
  'GET /' ({ Author, send }) {
    Author.find().populate('books').exec()
      .then(authors => {
        authors = authors.map(author => {
          return { ...author.toJSON(), books: author.books }
        })

        send(authors)
      })
      .catch(err => send(err))
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Author, reply, send, params }) => {
      Author.findById(params.id).populate('books').exec()
        .then(author => {
          if (!author) {
            reply.code(404).send(new Error('Author not found'))
          } else {
            send(author)
          }
        })
        .catch(err => send(err))
    }
  ],

  'POST /': [
    {
      body: {
        firstName: 'string',
        lastName: 'string'
      }
    },
    ({ Author, body, send }) => {
      const author = new Author(body)

      author.save()
        .then(() => send(author))
        .catch(err => send(err))
    }
  ],

  'PUT /:id': [
    {
      params: {
        id: 'string'
      },
      body: {
        fistName: 'string',
        lastName: 'string'
      }
    },
    ({ Author, send, params, body }) => {
      Author.findByIdAndUpdate(params.id, { $set: body }, { new: true })
        .then(author => send(author))
        .catch(err => send(err))
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Author, send, params }) => {
      Author.findByIdAndRemove(params.id)
        .then(author => send(author))
        .catch(err => send(err))
    }
  ]
}
