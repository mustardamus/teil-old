const { join } = require('path')
const modelsObject = require('../lib/models-object')

const modelsGlob = join(__dirname, '../example/models/*.js')

describe('Models Object', () => {
  it('should return an object of compiled models from a folder', () => {
    return modelsObject(modelsGlob)
      .then(models => {
        expect(models === Object(models)).toBe(true)
        expect(models.Author).toBeTruthy()
        expect(models.Author).toBeInstanceOf(Function)
        expect(models.Book).toBeTruthy()
        expect(models.Book).toBeInstanceOf(Function)

        const author = new models.Author({ firstName: '1', lastName: '2' })
        const book = new models.Book({ title: 'Title' })

        expect(author.firstName).toBe('1')
        expect(author.lastName).toBe('2')
        expect(book.title).toBe('Title')
      })
  })
})
