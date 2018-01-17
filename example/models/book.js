module.exports = {
  schema ({ Types }) {
    return {
      title: String,
      author: { type: Types.ObjectId, ref: 'Author' }
    }
  },

  options: {
    timestamps: true
  }
}
