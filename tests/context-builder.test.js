const { join } = require('path')
const contextBuilder = require('../lib/context-builder')

describe('Context Builder', () => {
  it('should return the default context', () => {
    return contextBuilder().then(context => {
      expect(context === Object(context)).toBe(true)
    })
  })

  it('should combine with another context', () => {
    return contextBuilder({ success: true }).then(context => {
      expect(context === Object(context)).toBe(true)
      expect(context.success).toBeTruthy()
    })
  })

  it('should add the models field if modelsGlob option is set', () => {
    const options = {
      modelsGlob: join(__dirname, '../example/models/*.js')
    }

    return contextBuilder({}, options).then(context => {
      expect(context === Object(context)).toBe(true)
      expect(context.models).toBeTruthy()
    })
  })

  it('should expand the context with model names', () => {
    const ctx = {
      models: {
        User: true,
        Post: true
      }
    }

    return contextBuilder(ctx).then(context => {
      expect(context === Object(context)).toBe(true)
      expect(context.models).toBeTruthy()
      expect(context.User).toBeTruthy()
      expect(context.Post).toBeTruthy()
    })
  })
})
