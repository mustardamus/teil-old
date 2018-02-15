module.exports = {
  schema: {
    firstName: String,
    lastName: String
  },

  options: {
    timestamps: true,
    toObject: { getters: true }
  },

  virtuals: {
    books: {
      ref: 'Book',
      localField: '_id',
      foreignField: 'author'
    }
  }
}
