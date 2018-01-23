module.exports = {
  async 'GET /' ({ Author, send, log, _: { map, pick } }) {
    const authors = await Author.find().populate('books').exec()
    const retObj = authors.map(author => {
      return {
        _id: author._id.toString(), // .toString() so it logs nicely
        firstName: author.firstName,
        lastName: author.lastName,
        createdAt: author.createdAt,

        // here you could use .map as well, this is only an example
        // showing how to use lodash functions
        books: map(author.books, book => pick(book, ['_id', 'title']))
      }
    })

    log('Sending authors...', retObj)
    send(retObj)
  },

  'GET /:id': [
    {
      params: {
        id: 'string'
      },
      response: {
        _id: 'isObjectId',
        firstName: 'string',
        lastName: 'string',
        __v: 'number?',
        updatedAt: 'date?',
        createdAt: 'date?'
      }
    },
    async ({ Author, send, sendStatus, params, log }) => {
      const author = await Author.findById(params.id).populate('books').exec()

      if (author) {
        send(author)
      } else {
        sendStatus(404)
      }
    }
  ],

  'POST /': [
    {
      body: {
        firstName: 'isNotEmpty',
        lastName: 'isNotEmpty',
        books: 'array?'
      }
    },
    async ({ Author, body, send }) => {
      const author = new Author(body)

      await author.save()
      send(author)
    }
  ],

  'PUT /:id': [
    {
      params: {
        id: 'string'
      }
      /* body: { // TODO doesnt work with the tests, have a real world example
        fistName: 'string?',
        lastName: 'string?',
        books: 'array?'
      } */
    },
    async ({ Author, send, params, body }) => {
      const author = await Author.findByIdAndUpdate(params.id, { $set: body }, { new: true })
      send(author)
    }
  ],

  'DELETE /:id': [
    {
      params: {
        id: 'string'
      }
    },
    async ({ Author, Book, send, params }) => {
      await Author.findByIdAndRemove(params.id)
      await Book.remove({ author: params.id })

      send({ success: true })
    }
  ]
}
