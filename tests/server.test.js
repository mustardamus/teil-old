const { join } = require('path')
const request = require('request')
const server = require('../lib/server')

const configPath = join(__dirname, '../example/teil.config.js')
const options = {
  port: 14677
}

beforeAll(() => {
  return server.start(configPath, options)
})

afterAll(() => {
  server.stop()
})

const req = (method, url) => {
  return new Promise((resolve, reject) => {
    request({
      method,
      url: `http://localhost:${options.port}${url}`,
      json: true
    }, (err, res, body) => {
      if (err) {
        return reject(err)
      }

      resolve(body, request)
    })
  })
}

describe('Models Object', () => {
  it('should render the index route', () => {
    return req('get', '/').then(body => {
      expect(body).toEqual({ route: 'index' })
    })
  })

  it('should render the users route', () => {
    return req('get', '/users').then(body => {
      expect(body[0]._id).toBeTruthy()
      expect(body[1]._id).toBeTruthy()
      expect(body[0].name).toBe('user1')
      expect(body[1].name).toBe('user2')
    })
  })
})
