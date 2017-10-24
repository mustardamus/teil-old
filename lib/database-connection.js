const mongoose = require('mongoose')
const startMongod = require('./start-mongod')

mongoose.Promise = global.Promise

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    const opt = options.database

    startMongod(opt.mongod)
      .then(() => {
        mongoose.connect(opt.url, opt.mongoose)

        const db = mongoose.connection

        db.on('error', err => reject(err))
        db.once('open', () => resolve(db))
      })
      .catch(err => reject(err))
  })
}
