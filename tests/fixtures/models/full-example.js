module.exports = {
  name: 'Post',

  options: {
    collection: 'SomePosts'
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
  }
}
