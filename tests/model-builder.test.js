const { join } = require('path')
const mongoose = require('mongoose')
const modelBuilder = require('../lib/model-builder')

const fixDir = join(__dirname, 'fixtures/models')

describe('Model Builder', () => {
  it('should build a valid mongoose model constrcutor of an exported object', () => {
    const path = join(fixDir, 'full-example.js')

    return modelBuilder(path).then(Model => {
      expect(Model).toBeInstanceOf(Function)

      const model = new Model({ title: 'success' })

      expect(mongoose.Types.ObjectId.isValid(model._id)).toBe(true)
      expect(model.title).toBe('success')

      model.email = 'valid@email.com'

      expect(model.email).toBe('valid@email.com')
      expect(model.giveBackTitle()).toBe('success')
      expect(Model.giveBackTrue()).toBe(true)
      expect(Model.find().giveBackArray()).toEqual([])
    })
  })
})
