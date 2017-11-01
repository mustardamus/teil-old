module.exports = {
  'GET /' ({ Book, send }) {
    Book.find().populate('author').exec()
      .then(books => send(books))
      .catch(err => send(err))
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Book, reply, send, params }) => {
      Book.findById(params.id).exec()
        .then(book => {
          if (!book) {
            reply.code(404).send(new Error('Book not found'))
          } else {
            send(book)
          }
        })
        .catch(err => send(err))
    }
  ],

  'POST /': [
    {
      body: {
        title: 'string',
        author: 'string'
      }
    },
    ({ Book, body, send }) => {
      const book = new Book(body)

      book.save()
        .then(() => send(book))
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
        authorId: 'string'
      }
    },
    ({ Book, send, params, body }) => {
      Book.findByIdAndUpdate(params.id, { $set: body }, { new: true })
        .then(book => send(book))
        .catch(err => send(err))
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    ({ Book, send, params }) => {
      Book.findByIdAndRemove(params.id)
        .then(book => send(book))
        .catch(err => send(err))
    }
  ]
}
