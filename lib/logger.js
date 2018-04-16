const { merge } = require('lodash')
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
  const defaults = {
    time: {
      yes: true,
      print (date) {
        const hours = fixPrefix(date.getHours())
        const minutes = fixPrefix(date.getMinutes())
        const seconds = fixPrefix(date.getSeconds())

        return `${hours}:${minutes}:${seconds} `.darkGray
      }
    },

    locate: {
      print ({ fileShort, line }) {
        if (!fileShort || skipFileLocations.includes(fileShort) || !line) {
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
  }

  const customOptions = options.logger && options.logger.olologOptions ? options.logger.olologOptions : {}
  const loggerOptions = merge({}, defaults, customOptions)

  return ololog.configure(loggerOptions)
}
