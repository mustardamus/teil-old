module.exports = {
  schema ({ validate }) {
    return {
      email: {
        type: String,
        validate: [
          validate.String.isEmailLike,
          '{VALUE} is not a valid e-mail'
        ]
      },

      url: {
        type: String,
        validate: {
          validator: val => validate.String.isUrl(val),
          message: '{VALUE is not a valid URL}'
        }
      }
    }
  }
}
