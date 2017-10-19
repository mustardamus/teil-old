const { join } = require('path')
const request = require('request')
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
    return modelsObject(options.modelsGlob)
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

beforeAll(() => {
  return new Promise((resolve, reject) => {
    server.start(configPath, options)
      .then(({ app, watcher, db }) => {
        return dropDb().then(() => resolve())
      })
      .catch(err => reject(err))
  })
})

afterAll(() => {
  server.stop()
})

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

  it('should get all the users (none) in the db', () => {
    return req('get', '/users').then(body => {
      expect(body).toEqual([])
    })
  })

  it('should create a new user', () => {
    return req('post', '/users', fixtures.users[0]).then(body => {
      expect(body._id).toBeTruthy()
      expect(body.name).toBe(fixtures.users[0].name)

      fixtures.users[0] = body
    })
  })

  it('should get all the users in the db', () => {
    return req('get', '/users').then(body => {
      expect(body.length).toBe(1)
      expect(body[0].name).toBe(fixtures.users[0].name)
    })
  })

  it('should get a single user', () => {
    return req('get', `/users/${fixtures.users[0]._id}`).then(body => {
      expect(body).toEqual(fixtures.users[0])
    })
  })

  it('should update a single user', () => {
    const data = { name: 'user1updated' }

    return req('put', `/users/${fixtures.users[0]._id}`, data).then(body => {
      expect(body.name).toEqual(data.name)

      fixtures.users[0].name = body.name

      req('get', `/users/${fixtures.users[0]._id}`).then(body => {
        expect(body).toEqual(fixtures.users[0])
      })
    })
  })

  /* it('should delete a single user', () => {
    return req('delete', `/users/${fixtures.users[0]._id}`).then(body => {
      expect(body).toEqual({ success: true })
    })
  }) */
})
