const StackTracey = require('stacktracey')
const logger = require('./logger')
const contextBuilder = require('./context-builder')

let log, res

// TODO there must be a better way...
// this also only works with `async` wrappers
// otherwise check if handler is a Promise, and catch errors

process.on('unhandledRejection', err => {
  const stack = new StackTracey(err)

  if (stack[0].fileShort.includes('controllers/')) {
    logAndSendPrettyStack(log, res, err)
  }
})

const logAndSendPrettyStack = (log, reply, err) => {
  const stack = new StackTracey(err).pretty
  log.error(err)
  reply.status(500).send(`<pre>${stack}</pre>`)
}

module.exports = (handler, options = {}) => {
  const orgHandler = handler.bind({})
  log = logger(options)

  return async (request, reply, next) => {
    res = reply

    if (orgHandler.length === 1) {
      const context = await contextBuilder({ request, reply, next }, options)
      orgHandler(context) // if there is an error, it will be handled by the 'unhandledRejection' callback above
    } else {
      try { // synchronous function handled with good ol try/catch
        return orgHandler(request, reply, next)
      } catch (err) {
        logAndSendPrettyStack(log, reply, err)
      }
    }
  }
}
