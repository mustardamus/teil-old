const authorSchema = {
  200: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' }
      // books: { type: 'array' }
    }
  }
}

module.exports = {
  'GET /': [
    /* {
      response: {
        200: {
          type: 'array',
          items: {
            type: [
              {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  books: { type: 'array' }
                }
              }
            ]
          }
        }
      }
    }, */
    ({ Author, send }) => {
      Author.find().populate('books').exec()
        .then(authors => {
          // needed to actually populate the books
          authors = authors.map(({ _id, firstName, lastName, books }) => {
            books = books.map(({ _id, title }) => ({ _id, title })) // TODO put that in model toJSON method
            return { _id, firstName, lastName, books }
          })

          send(authors)
        })
        .catch(err => send(err))
    }
  ],

  'GET /:id': [
    {
      params: {
        id: 'string'
      },
      response: authorSchema
    },
    ({ Author, reply, send, params }) => {
      Author.findById(params.id).populate('books').exec()
        .then(author => {
          if (!author) {
            reply.sendStatus(404)
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
      },
      response: authorSchema
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
      },
      response: authorSchema
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
      },
      response: authorSchema
    },
    ({ Author, send, params }) => {
      Author.findByIdAndRemove(params.id)
        .then(author => send(author))
        .catch(err => send(err))
    }
  ]
}
