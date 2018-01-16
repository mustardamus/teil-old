/* const authorSchema = {
  200: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' }
      // books: { type: 'array' }
    }
  }
} */

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
    async ({ Author, send, log, _: { map, pick } }) => {
      const authors = await Author.find().populate('books').exec()
      const retObj = authors.map(({ _id, firstName, lastName, books }) => {
        books = map(books, book => pick(book, ['_id', 'title']))
        return { _id, firstName, lastName, books }
      })

      send(retObj)
    }
  ],

  'GET /:id': [
    /* {
      params: {
        id: 'string'
      },
      response: authorSchema
    }, */
    async ({ Author, send, sendStatus, params }) => {
      const author = await Author.findById(params.id).populate('books').exec()

      if (author) {
        send(author)
      } else {
        sendStatus(404)
      }
    }
  ],

  'POST /': [
    /* {
      body: {
        firstName: 'string',
        lastName: 'string'
      },
      response: authorSchema
    }, */
    async ({ Author, body, send }) => {
      const author = new Author(body)

      await author.save()
      send(author)
    }
  ],

  'PUT /:id': [
    /* {
      params: {
        id: 'string'
      },
      body: {
        fistName: 'string',
        lastName: 'string'
      },
      response: authorSchema
    }, */
    async ({ Author, send, params, body }) => {
      const author = await Author.findByIdAndUpdate(params.id, { $set: body }, { new: true })
      send(author)
    }
  ],

  'DELETE /:id': [
    /* {
      params: {
        id: 'string'
      },
      response: authorSchema
    }, */
    async ({ Author, Book, send, params }) => {
      await Author.findByIdAndRemove(params.id)
      await Book.remove({ author: params.id })

      send({ success: true })
    }
  ]
}
