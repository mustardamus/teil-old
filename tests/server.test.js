const { join } = require('path')
const request = require('supertest')
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

let app

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

beforeAll(() => {
  return server.start(configPath, options).then(obj => {
    app = obj.app
  })
})

beforeEach(() => dropDb())
afterAll(() => server.stop())

describe('Server', () => {
  it('should render the index.html from the static path route', () => {
    return request(app).get('/')
      .then(({ text }) => {
        expect(text.includes('<title>Teil - Book Store Demo</title>')).toBe(true)
      })
  })

  it('should have the basic CRUD operations', () => {
    const authorFixture = fixtures.authors[0]
    const r = request(app)

    return r.get('/api/authors')
      .then(({ body }) => {
        expect(body).toEqual([])

        return r.post('/api/authors').send(authorFixture)
          .then(({ body }) => {
            const author = body

            expect(body._id).toBeTruthy()
            expect(body.firstName).toBe(authorFixture.firstName)
            expect(body.lastName).toBe(authorFixture.lastName)

            return r.get('/api/authors')
              .then(({ body }) => {
                expect(body.length).toBe(1)
                expect(body[0].firstName).toBe(author.firstName)

                return r.get(`/api/authors/${author._id}`)
                  .then(({ body }) => {
                    expect(body).toEqual(author)

                    const obj = { firstName: 'updated' }

                    return r.put(`/api/authors/${author._id}`).send(obj)
                      .then(({ body }) => {
                        expect(body._id).toBe(author._id)
                        expect(body.firstName).toBe('updated')
                        expect(body.lastName).toBe(author.lastName)

                        return r.delete(`/api/authors/${author._id}`)
                          .then(({ body }) => {
                            expect(body).toEqual({ success: true })

                            return r.get('/api/authors')

                              .then(({ body }) => {
                                expect(body.length).toBe(0)
                              })
                          })
                      })
                  })
              })
          })
      })
  })

  it('should return a 404 on non existing entry', () => {
    return request(app).get(`/api/authors/${Types.ObjectId()}`)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({})
      })
  })
})
