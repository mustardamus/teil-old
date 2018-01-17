let middlewareHook

module.exports = {
  name: 'Post',

  options: {
    collection: 'SomePosts',
    read: 'secondaryPreferred'
  },

  schema ({ Types, validate }) {
    return {
      someId: Types.ObjectId,
      title: { type: String, required: true },
      email: {
        type: String,
        validate: [
          validate.String.isEmailLike,
          '{VALUE} is not a valid e-mail'
        ]
      },
      content: {
        type: String,
        validate: {
          validator (val) {
            return val.length > 140
          },
          message: 'content must have more than 140 characters'
        }
      }
    }
  },

  methods: {
    giveBackTitle () {
      return this.title
    }
  },

  statics: {
    giveBackTrue () {
      return true
    }
  },

  queries: {
    giveBackArray () {
      return []
    }
  },

  virtuals: {
    virtualTitle: {
      get () {
        return this.title
      },

      set (val) {
        this.title = val
      }
    },

    middlewareHook: {
      get () {
        return middlewareHook
      },

      set (val) {
        middlewareHook = val
      }
    }
  },

  middlewares: {
    'pre-validate' (next) {
      middlewareHook()
      next()
    }
  }
}
