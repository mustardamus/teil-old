module.exports = {
  async 'GET /' ({ Book, send }) {
    const books = await Book.find().populate('author').exec()
    send(books)
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      }
    },
    async ({ Book, send, sendStatus, params }) => {
      const book = await Book.findById(params.id).exec()

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
        title: 'string',
        author: 'string'
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
      }
      /* body: {
        title: 'string',
        authorId: 'string'
      } */
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
