module.exports = {
  'GET /' ({ send }) { // this is overwritten by static/index.html
    send({ route: 'index' })
  }
}
