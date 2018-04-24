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

  it('should create shortcuts of common used request fields', () => {
    const ctx = {
      req: {
        app: true,
        query: true,
        body: true,
        params: true,
        cookies: true,
        session: true
      },
      other: true
    }

    return contextBuilder(ctx).then(context => {
      expect(context.app).toBe(true)
      expect(context.query).toBe(true)
      expect(context.body).toBe(true)
      expect(context.params).toBe(true)
      expect(context.cookies).toBe(true)
      expect(context.session).toBe(true)
      expect(context.other).toBe(true)
    })
  })

  it('should create shortcuts of common used response fields', () => {
    const ctx = {
      res: {
        append: jest.fn(),
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        download: jest.fn(),
        get: jest.fn(),
        json: jest.fn(),
        jsonp: jest.fn(),
        redirect: jest.fn(),
        send: jest.fn(),
        sendFile: jest.fn(),
        sendStatus: jest.fn(),
        set: jest.fn(),
        status: jest.fn()
      },
      other: true
    }

    return contextBuilder(ctx).then(context => {
      expect(typeof context.appendHeader).toBe('function')
      expect(typeof context.setCookie).toBe('function')
      expect(typeof context.clearCookie).toBe('function')
      expect(typeof context.download).toBe('function')
      expect(typeof context.getHeader).toBe('function')
      expect(typeof context.json).toBe('function')
      expect(typeof context.jsonp).toBe('function')
      expect(typeof context.redirect).toBe('function')
      expect(typeof context.send).toBe('function')
      expect(typeof context.sendFile).toBe('function')
      expect(typeof context.sendStatus).toBe('function')
      expect(typeof context.setHeader).toBe('function')
      expect(typeof context.status).toBe('function')
      expect(context.other).toBe(true)
    })
  })

  it('should include lodash as _', () => {
    return contextBuilder().then(context => {
      expect(context._).toBeTruthy()
      expect(context._.isFunction).toBeTruthy()
    })
  })

  it('should extend the context with an object defined in the options', () => {
    const ctx = { org: true }
    const options = {
      extendContext: {
        extended: true
      }
    }

    return contextBuilder(ctx, options).then(context => {
      expect(context.org).toBe(true)
      expect(context.extended).toBe(true)
    })
  })
})
