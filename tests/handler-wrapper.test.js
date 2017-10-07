const handlerWrapper = require('../lib/handler-wrapper')

describe('Handler Wrapper', () => {
  test('it should accept request, reply, next and pass it back as object destructuring', () => {
    const request = 'request'
    const reply = 'reply'
    const next = 'next'
    const handlerArgs = jest.fn((request, reply, next) => {})
    const wrapperArgs = handlerWrapper(handlerArgs)
    const handlerObj = jest.fn(({ request, reply, next }) => {})
    const wrapperObj = handlerWrapper(handlerObj)

    expect(typeof wrapperArgs).toBe('function')
    expect(typeof wrapperObj).toBe('function')

    wrapperArgs(request, reply, next)

    const callsArgs = handlerArgs.mock.calls

    expect(callsArgs.length).toBe(1)
    expect(callsArgs[0][0]).toBe(request)
    expect(callsArgs[0][1]).toBe(reply)
    expect(callsArgs[0][2]).toBe(next)

    wrapperObj(request, reply, next)

    const callsObj = handlerObj.mock.calls

    expect(callsObj.length).toBe(1)
    expect(callsObj[0][0].request).toBe(request)
    expect(callsObj[0][0].reply).toBe(reply)
    expect(callsObj[0][0].next).toBe(next)
  })
})
