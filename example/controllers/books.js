module.exports = {
  'GET /': [
    {
      response ({ data, _: { pick } }) {
        return data.map(book => ({
          ...pick(book, ['_id', 'title']),
          author: pick(book.author, ['_id', 'firstName', 'lastName'])
        }))
      }
    },

    async ({ Book, send }) => {
      const books = await Book.find().populate('author').exec()
      send(books)
    }
  ],

  'GET /:id': [
    {
      params: {
        id: 'string'
      },
      response ({ data, _: { pick } }) {
        return {
          ...pick(data, ['_id', 'title', 'createdAt', 'updatedAt']),
          author: pick(data.author, ['_id', 'firstName', 'lastName'])
        }
      }
    },

    async ({ Book, send, sendStatus, params }) => {
      const book = await Book.findById(params.id).populate('author').exec()

      if (book) {
        send(book)
      } else {
        sendStatus(404)
      }
    }
  ],

  'POST /': [
    {
      body: {
        title: 'isNotEmpty',
        author: 'isObjectId'
      }
    },

    async ({ Book, body, send }) => {
      const book = new Book(body)

      await book.save()
      send(book)
    }
  ],

  'PUT /:id': [
    {
      params: {
        id: 'string'
      },
      body: {
        title: 'isNotEmpty?'
      }
    },

    async ({ Book, send, params, body }) => {
      const book = await Book.findByIdAndUpdate(params.id, { $set: body }, { new: true })
      send(book)
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },

    async ({ Book, send, params }) => {
      await Book.findByIdAndRemove(params.id)
      send({ success: true })
    }
  ]
}
