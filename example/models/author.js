module.exports = {
  schema: {
    firstName: String,
    lastName: String
  },

  virtuals: {
    books: {
      ref: 'Book',
      localField: '_id',
      foreignField: 'author'
    }
  }
}
