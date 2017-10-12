const { join } = require('path')
const modelsObject = require('../lib/models-object')

const modelsGlob = join(__dirname, '../example/models/*.js')

describe('Models Object', () => {
  it('should return an object of compiled models from a folder', () => {
    return modelsObject(modelsGlob)
      .then(models => {
        expect(models === Object(models)).toBe(true)
        expect(models.User).toBeTruthy()
        expect(models.User).toBeInstanceOf(Function)
        expect(models.Post).toBeTruthy()
        expect(models.Post).toBeInstanceOf(Function)

        const user = new models.User({ name: 'me' })
        const post = new models.Post({ title: 'Title' })
        post.content = 'Content'

        expect(user.name).toBe('me')
        expect(post.title).toBe('Title')
        expect(post.content).toBe('Content')
      })
  })
})
