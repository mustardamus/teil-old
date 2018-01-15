const StackTracey = require('stacktracey')
const logger = require('./logger')
const contextBuilder = require('./context-builder')

let log = console
let res

// TODO there must be a better way...
// this also only works with `async` wrappers
// otherwise check if handler is a Promise, and catch errors

process.on('unhandledRejection', (err, promise) => {
  const stack = new StackTracey(err)

  if (stack[0] && stack[0].fileShort.includes('controllers/')) {
    return logAndSendPrettyStack(log, res, err)
  }

  // catching all other errors...
  log.error(err) // TODO this should be somewhere else
})

const logAndSendPrettyStack = (log, response, err) => {
  const stack = new StackTracey(err).pretty

  log.error(err)
  response.status(500).send(`<pre>${stack}</pre>`)
}

module.exports = (handler, options = {}) => {
  const orgHandler = handler.bind({})
  log = logger(options)

  return async (request, response, next) => {
    res = response

    try { // synchronous function handled with good ol try/catch
      // if there is an async error, it will be handled by the 'unhandledRejection' callback above

      if (orgHandler.length === 1) {
        const context = await contextBuilder({ request, response, next }, options)
        orgHandler(context)
      } else {
        return orgHandler(request, response, next)
      }
    } catch (err) {
      logAndSendPrettyStack(log, response, err)
    }
  }
}
