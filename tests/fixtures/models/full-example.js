let middlewareHook

module.exports = {
  name: 'Post',

  options: {
    collection: 'SomePosts',
    read: 'secondaryPreferred'
  },

  schema ({ Types, validator: { isEmail }, _: { isString } }) {
    return {
      someId: Types.ObjectId,
      title: { type: String, required: true },
      email: {
        type: String,
        validate: {
          validator: val => isEmail(val),
          message: '{VALUE} is not a valid e-mail'
        }
      },
      content: {
        type: String,
        validate: {
          validator: val => isString(val) && val.length > 140,
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
