
module.exports = {
  'GET /': [
    {
      response ({ data, _: { pick } }) {
        return data.map(author => ({
          ...pick(author, ['_id', 'firstName', 'lastName']),
          bookCount: author.books.length
        }))
      }
    },

    async ({ Author, log, send }) => {
      const authors = await Author.find().populate('books').exec()

      log(`Sending back ${authors.length} authors...`)
      send(authors)
    }
  ],

  'GET /:id': [
    {
      params: {
        id: 'string'
      },
      response ({ data, _: { pick } }) {
        return {
          ...pick(data, ['_id', 'firstName', 'lastName', 'createdAt', 'updatedAt']),
          books: data.books.map(book => pick(book, ['_id', 'title']))
        }
      }
    },

    async ({ Author, params, send, sendStatus }) => {
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
        lastName: 'isNotEmpty'
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
      },
      body: {
        firstName: 'isNotEmpty?',
        lastName: 'isNotEmpty?'
      }
    },
    async ({ Author, params, body, send }) => {
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
    async ({ Author, Book, params, send }) => {
      await Author.findByIdAndRemove(params.id)
      await Book.remove({ author: params.id })

      send({ success: true })
    }
  ],

  'GET /failing' ({ Author, send, log }) {
    // this is an example on how promises that are not returned and fail will
    // still be logged, but dont respond to the client
    Author.find().populate('books').exec().then(authors => {
      log('This will crash in 3.. 2.. 1..')
      methodDoesNotExist() // eslint-disable-line
      send(authors)
    })
  }
}
