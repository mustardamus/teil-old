const { join } = require('path')

module.exports = {
  controllersGlob: join(__dirname, './controllers/*.js'),
  modelsGlob: join(__dirname, './models/*.js')
}
