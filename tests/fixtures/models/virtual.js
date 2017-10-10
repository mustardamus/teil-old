module.exports = {
  virtual: {
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
    }
  }
}
