module.exports = {
  schema ({ Types }) {
    return {
      name: String,
      userId: Types.ObjectId,
      meta: Types.Mixed
    }
  }
}
