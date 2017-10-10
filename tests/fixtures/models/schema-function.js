module.exports = {
  schema (Schema) {
    return {
      name: String,
      userId: Schema.Types.ObjectId,
      meta: Schema.Types.Mixed
    }
  }
}
