const { join } = require('path')
const request = require('request')
const { Types } = require('mongoose')
const server = require('../lib/server')
const modelsObject = require('../lib/models-object')
const fixtures = require('./fixtures/server/data')

const configPath = join(__dirname, '../example/teil.config.js')
const options = {
  port: 14677,
  modelsGlob: join(__dirname, '../example/models/*.js'),
  logger: {
    level: 'silent'
  },
  database: {
    // TODO pass in as option
    url: 'mongodb://localhost/teil-test'
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
      url: `http://localhost:${options.port}${url}`,
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
  it('should render the index route', () => {
    return req('get', '/').then(body => {
      expect(body).toEqual({ route: 'index' })
    })
  })

  it('should have the basic CRUD operations', () => {
    let user1

    return req('get', '/users')
      .then(body => {
        expect(body).toEqual([])

        return req('post', '/users', fixtures.users[0])
      })
      .then(body => {
        expect(body._id).toBeTruthy()
        expect(body.name).toBe(fixtures.users[0].name)

        user1 = body
        return req('get', '/users')
      })
      .then(body => {
        expect(body.length).toBe(1)
        expect(body[0].name).toBe(user1.name)

        return req('get', `/users/${user1._id}`)
      })
      .then(body => {
        expect(body).toEqual(user1)

        const data = { name: 'user1updated' }
        return req('put', `/users/${user1._id}`, data)
      })
      .then(body => {
        expect(body.name).toEqual('user1updated')

        return req('get', `/users/${Types.ObjectId()}`)
      })
      .then(body => {
        expect(body).toEqual({
          'error': 'Not Found',
          'message': 'User not found',
          'statusCode': 404
        })

        return req('delete', `/users/${user1._id}`)
      })
      .then(body => {
        expect(body).toEqual({ success: true })
      })
  })
})
