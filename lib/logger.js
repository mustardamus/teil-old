module.exports = (options = {}) => {
  const pino = require('pino')
  return pino(options.logger)
}

/*
module.exports = (options = {}) => {
  let log

  if (options.dev) { // skip it for the first release, but its real nice
    const ololog = require('ololog').configure({
      time: true,
      locate: {
        print ({ calleeShort, fileName, line }) {
          if (fileName && line) {
            return chalk.inverse.grey(`${calleeShort} - ${fileName}:${line}`)
          }
        }
      }
    })
    const chalk = require('chalk')
    const { isString } = require('lodash')

    const logIt = (color, level, args) => {
      ololog.apply(level, [chalk[color](level), ...args])
    }

    log = {
      info (...args) {
        // info, error, debug, fatal, warn, trace, child
        logIt('blue', 'info', args)
      },
      error (...args) {
        logIt('red', 'error', args)
      },
      debug (...args) {
        args.forEach((arg, i) => {
          if (isString(arg)) {
            args[i] = chalk.gray(arg)
          }
        })

        logIt('cyan', 'teil', args)
      }
    }
  } else {
    const pino = require('pino')
    log = pino(options.logger)
  }

  return log
}
*/
