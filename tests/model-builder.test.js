const { join } = require('path')
const mongoose = require('mongoose')
const modelBuilder = require('../lib/model-builder')
const databaseConnection = require('../lib/database-connection')

const dbConnection = databaseConnection({
  database: {
    url: 'mongodb://localhost/teil-test'
  }
})

const fixDir = join(__dirname, 'fixtures/models')
const modelPath = join(fixDir, 'full-example.js')

describe('Model Builder', () => {
  it('should build a valid mongoose model constrcutor of an exported object', () => {
    return modelBuilder(modelPath).then(Model => {
      expect(Model).toBeInstanceOf(Function)

      const model = new Model({ title: 'success' })

      expect(mongoose.Types.ObjectId.isValid(model._id)).toBe(true)
      expect(Model.schema.options.collection).toBe('SomePosts')
      expect(Model.schema.options.read.mode).toBe('secondaryPreferred')
      expect(model.title).toBe('success')

      model.email = 'valid@email.com'

      expect(model.email).toBe('valid@email.com')
      expect(model.giveBackTitle()).toBe('success')
      expect(Model.giveBackTrue()).toBe(true)
      expect(Model.find().giveBackArray()).toEqual([])

      expect(model.virtualTitle).toBe(model.title)
      model.virtualTitle = 'yo'
      expect(model.virtualTitle).toBe('yo')

      model.middlewareHook = jest.fn()
      model.validate()
      expect(model.middlewareHook.mock.calls.length).toBe(1)
    })
  })

  it('should return a duplicate error as normal field validation', () => {
    const email = 'unique-test@example.com'

    return dbConnection.then(db => {
      return modelBuilder(modelPath).then(async Model => {
        const model1 = new Model({ title: 'unique-one', email })
        const model2 = new Model({ title: 'unique-two', email })

        await model1.save()

        const model1Rec = await Model.findOne({ title: 'unique-one' })

        expect(model1Rec.email).toBe(email)

        try {
          await model2.save()
        } catch (err) {
          expect(err).toBeTruthy()
          expect(err.message).toBe('Validation failed')
          expect(err.errors).toBeTruthy()
          expect(err.errors.email.message).toBe('Path `email` (unique-test@example.com) is not unique.')

          await model1.remove()
        }
      })
    })
  })
})
