const { join } = require('path')

module.exports = {
  controllersGlob: join(__dirname, './controllers/*.js'),
  modelsGlob: join(__dirname, './models/*.js'),
  staticPath: join(__dirname, './static'),

  database: {
    url: 'mongodb://localhost/teil-test'
  },

  expressSettings: {
    'trust proxy': true
  }
}
