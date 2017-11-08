module.exports = [
  (request, reply, payload, next) => {
    console.log('onSend Hook Log Payload', payload)
    next()
  }
]
