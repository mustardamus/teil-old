module.exports = [
  (request, response, payload, next) => {
    console.log('onSend Hook Log Payload', payload)
    next()
  }
]
