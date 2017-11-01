module.exports = {
  virtuals: {
    first: {
      get () {
        return 'get'
      },

      set (val) {
        return val
      }
    },

    second: {
      get () {
        return 'get'
      },

      set (val) {
        return val
      }
    },

    third: {
      ref: 'Book',
      localField: '_id',
      foreignField: 'author'
    }
  }
}
