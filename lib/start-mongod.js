const { dirname } = require('path')
const { existsSync } = require('fs')
const { lookup, kill } = require('ps-node')
const { which, exec, mkdir } = require('shelljs')
const { objectToCliArgs } = require('./helpers')

let mongodWasStarted = false

const isMongodRunning = () => {
  return new Promise((resolve, reject) => {
    lookup({ command: 'mongod' }, (err, results) => {
      if (err) {
        return reject(err)
      }

      if (results.length === 0) {
        const err = new Error(`No 'mongod' process found`)
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

const cleanUp = () => {
  process.stdin.resume()

  if (mongodWasStarted) {
    isMongodRunning().then(results => {
      kill(results[0].pid, err => {
        if (err) {
          throw err
        }

        process.exit()
      })
    })
  } else {
    process.exit()
  }
}

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!which('mongod')) {
      const err = new Error(`The command 'mongod' was not found. is MongoDB installed?`)
      return reject(err)
    }

    isMongodRunning()
      .then(() => resolve())
      .catch(() => {
        const args = objectToCliArgs(options)
        const mongod = `mongod ${args}`
        const logPath = dirname(options.logpath)

        if (!existsSync(logPath)) {
          mkdir('-p', logPath)
        }

        if (!existsSync(options.dbpath)) {
          mkdir('-p', options.dbpath)
        }

        if (exec(mongod).code !== 0) {
          const err = new Error(`Could not start process 'mongod'`)
          reject(err)
        } else {
          mongodWasStarted = true
          resolve()
        }
      })

    process.on('exit', () => cleanUp())
    process.on('SIGINT', () => cleanUp())
  })
}
