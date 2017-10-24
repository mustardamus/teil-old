const mongoose = require('mongoose')
const ps = require('ps-node')
const { which, exec, mkdir } = require('shelljs')
const { existsSync } = require('fs')
const { dirname } = require('path')
const { objectToCliArgs } = require('./helpers')

mongoose.Promise = global.Promise
let mongodWasStarted = false

const isMongodRunning = () => {
  return new Promise((resolve, reject) => {
    ps.lookup({ command: 'mongod' }, (err, results) => {
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
      ps.kill(results[0].pid, err => {
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
    const opt = options.database

    if (!which('mongod')) {
      const err = new Error(`The command 'mongod' was not found. is MongoDB installed?`)
      return reject(err)
    }

    const connect = () => {
      mongoose.connect(opt.url, opt.mongoose)

      const db = mongoose.connection

      db.on('error', err => reject(err))
      db.once('open', () => resolve(db))
    }

    isMongodRunning()
      .then(() => connect())
      .catch(() => {
        const mongod = `mongod ${objectToCliArgs(opt.mongod)}`
        const logPath = dirname(opt.mongod.logpath)

        if (!existsSync(logPath)) {
          mkdir('-p', logPath)
        }

        if (!existsSync(opt.mongod.dbpath)) {
          mkdir('-p', opt.mongod.dbpath)
        }

        if (exec(mongod).code !== 0) {
          const err = new Error(`Could not start process 'mongod'`)
          reject(err)
        } else {
          mongodWasStarted = true
          connect()
        }
      })

    process.on('exit', () => cleanUp())
    process.on('SIGINT', () => cleanUp())
  })
}
