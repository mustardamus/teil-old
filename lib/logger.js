const ololog = require('ololog')
const ansicolor = require('ansicolor').nice // eslint-disable-line

const fixPrefix = val => {
  if (val < 10) {
    return `0${val}`
  }

  return val
}

const skipFileLocations = [
  'events.js',
  'internal/process/next_tick.js'
]

module.exports = (options = {}) => {
  const logger = ololog.configure({
    time: {
      yes: true,
      print (date) {
        let hours = fixPrefix(date.getHours())
        let minutes = fixPrefix(date.getMinutes())
        let seconds = fixPrefix(date.getSeconds())

        return `${hours}:${minutes}:${seconds} `.darkGray
      }
    },

    locate: {
      print ({ fileShort, line }) {
        if (!fileShort || skipFileLocations.includes(fileShort)) {
          return ''
        }

        return `(${fileShort}:${line})`.darkGray.italic
      }
    },

    '+render' (text, { consoleMethod = '' }) {
      const errString = 'ERR!'.lightRed
      consoleMethod = consoleMethod.toUpperCase()

      switch (consoleMethod) {
        case 'INFO':
          consoleMethod = consoleMethod.lightBlue
          break
        case 'WARN':
          consoleMethod = consoleMethod.lightYellow
          break
        case 'ERROR':
          consoleMethod = errString
          text = text.red
          break
        default:
          if (text.includes('[Error]')) {
            consoleMethod = errString
            text = text.red
          } else {
            consoleMethod = 'INFO'.lightBlue
          }
      }

      return `${consoleMethod} ${text}`
    }
  })

  return logger
}
