const handlerWrapper = require('../lib/handler-wrapper')

describe('Handler Wrapper', () => {
  test('it should accept request, reply, next and pass it back as object destructuring', () => {
    const request = 'request'
    const reply = 'reply'
    const next = 'next'
    const handler = jest.fn()
    const wrapper = handlerWrapper(handler)

    expect(typeof wrapper).toBe('function')

    wrapper(request, reply, next)

    const calls = handler.mock.calls
    const obj = calls[0][0]

    expect(calls.length).toBe(1)
    expect(obj.request).toBe(request)
    expect(obj.reply).toBe(reply)
    expect(obj.next).toBe(next)
  })
})
