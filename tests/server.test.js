const { join } = require('path')
const request = require('request')
const { Types } = require('mongoose')
const server = require('../lib/server')
const modelsObject = require('../lib/models-object')
const fixtures = require('./fixtures/server/data')

const examplePath = join(__dirname, '../example')
const configPath = join(examplePath, 'teil.config.js')
const options = {
  port: 14677,
  modelsGlob: join(examplePath, 'models/*.js'),
  logger: {
    level: 'silent'
  },
  database: {
    url: 'mongodb://localhost/teil-test',
    logPath: join(examplePath, 'db/mongod.log'),
    dbPath: join(examplePath, 'db')
  }
}

const dropDb = () => {
  return new Promise((resolve, reject) => {
    modelsObject(options.modelsGlob)
      .then(models => {
        const promises = Object.keys(models).map(modelName => {
          return new Promise((resolve, reject) => {
            models[modelName].remove(err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })
        })

        return Promise.all(promises).then(() => resolve())
      })
      .catch(err => reject(err))
  })
}

beforeAll(() => server.start(configPath, options))
beforeEach(() => dropDb())
afterAll(() => server.stop())

const req = (method, url, data = {}) => {
  return new Promise((resolve, reject) => {
    request({
      method,
      url: `http://localhost:${options.port}/api${url}`,
      json: true,
      body: data
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body, request)
      }
    })
  })
}

describe('Server', () => {
  it('should render the index.html from the static path route', done => {
    request({
      method: 'GET',
      url: `http://localhost:${options.port}/`
    }, (err, res, body) => {
      expect(err).toBeFalsy()
      expect(body.includes('<title>Teil - Book Store Demo</title>')).toBe(true)
      done()
    })
  })

  it('should have the basic CRUD operations', () => {
    let author1

    return req('get', '/authors')
      .then(body => {
        expect(body).toEqual([])

        return req('post', '/authors', fixtures.authors[0])
      })
      .then(body => {
        expect(body._id).toBeTruthy()
        expect(body.firstName).toBe(fixtures.authors[0].firstName)

        author1 = body
        return req('get', '/authors')
      })
      .then(body => {
        expect(body.length).toBe(1)
        expect(body[0].firstName).toBe(author1.firstName)

        return req('get', `/authors/${author1._id}`)
      })
      .then(body => {
        expect(body).toEqual(author1)

        const data = { firstName: 'author1updated' }
        author1.firstName = data.firstName

        return req('put', `/authors/${author1._id}`, data)
      })
      .then(body => {
        expect(body.firstName).toEqual('author1updated')

        return req('get', `/authors/${Types.ObjectId()}`)
      })
      .then(body => {
        expect(body).toEqual('Not Found')

        return req('delete', `/authors/${author1._id}`)
      })
      .then(body => {
        expect(body).toEqual(author1)
      })
  })
})
