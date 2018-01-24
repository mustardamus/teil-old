module.exports = {
  'GET /': [
    {
      response ({ data, _: { pick } }) {
        return data.map(({ _id, title, author }) => {
          return {
            _id,
            title,
            author: pick(author, ['_id', 'firstName', 'lastName'])
          }
        })
      }
    },
    ({ Book, send }) => {
      Book.find().populate('author').exec().then(books => {
        send(books)
      })
    }
  ],

  'GET /:id': [
    {
      params: {
        id: 'string'
      },
      response ({ data, _: { pick } }) {
        return pick(data, ['_id', 'title', 'author'])
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
      body ({ data, struct }) {
        struct({
          title: struct.intersection(['string', 'isNotEmpty']),
          author: struct.intersection(['string', 'isObjectId'])
        })(data)
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
