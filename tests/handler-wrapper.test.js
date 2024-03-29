const handlerWrapper = require('../lib/handler-wrapper')

describe('Handler Wrapper', () => {
  test('it should accept request, response, next and pass it back as object destructuring', () => {
    const req = {
      app: true,
      query: true,
      body: true,
      params: true,
      cookies: true
    }
    const res = {
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
    }
    const next = jest.fn()
    const handlerArgs = jest.fn((req, res, next) => {})
    const wrapperArgs = handlerWrapper(handlerArgs)
    const handlerObj = jest.fn(({ req, res, next }) => {})
    const wrapperObj = handlerWrapper(handlerObj)

    expect(typeof wrapperArgs).toBe('function')
    expect(typeof wrapperObj).toBe('function')

    wrapperArgs(req, res, next)

    const callsArgs = handlerArgs.mock.calls

    expect(callsArgs.length).toBe(1)
    expect(callsArgs[0][0]).toBe(req)
    expect(callsArgs[0][1]).toBe(res)
    expect(callsArgs[0][2]).toBe(next)

    return wrapperObj(req, res, next)
      .then(() => {
        const callsObj = handlerObj.mock.calls
        const args = callsObj[0][0]

        expect(callsObj.length).toBe(1)
        expect(args.req).toBe(req)
        expect(args.res).toBe(res)
        expect(typeof args.send).toBe('function')
        expect(args.next).toBe(next)
      })
  })
})
