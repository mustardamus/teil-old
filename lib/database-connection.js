const mongoose = require('mongoose')

mongoose.Promise = global.Promise

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

    const db = mongoose.connection

    db.on('error', (err) => reject(err))
    db.once('open', () => resolve(db))

    // TODO only if models dir exists
  })
}
