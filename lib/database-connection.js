const mongoose = require('mongoose')
const glob = require('glob')

mongoose.Promise = global.Promise

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    const modelFiles = glob.sync(options.modelsGlob)

    if (modelFiles.length === 0) {
      const err = new Error('No Models were found, skipping db connection')
      return reject(err)
    }

    mongoose.connect(options.database.url, options.database.mongooseOptions)

    const db = mongoose.connection

    db.on('error', (err) => reject(err))
    db.once('open', () => resolve(db))
  })
}
