module.exports = {
  schema ({ validator: { isEmail, isURL }, _: { isString } }) {
    return {
      email: {
        type: String,
        validate: [isEmail, '{VALUE} is not a valid e-mail']
      },

      url: {
        type: String,
        validate: {
          validator: val => isString(val) && isURL(val),
          message: '{VALUE is not a valid URL}'
        }
      }
    }
  }
}
