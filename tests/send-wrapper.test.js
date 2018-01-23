const sendWrapper = require('../lib/send-wrapper')

describe('Send Wrapper', () => {
  it('should return the original send function nothing is in between', () => {
    const send = jest.fn()
    const context = { res: { send } }

    sendWrapper(context)('data')

    expect(send.mock.calls.length).toBe(1)
    expect(send.mock.calls[0][0]).toBe('data')
  })

  it('should call .toObject on the data if it exists, turning it in an actual object', () => {
    const send = jest.fn()
    const context = { res: { send } }
    const toObject = jest.fn(() => true)
    const data = { toObject }

    sendWrapper(context)(data)

    expect(send.mock.calls.length).toBe(1)
    expect(send.mock.calls[0][0]).toBe(true)
    expect(toObject.mock.calls.length).toBe(1)
  })

  it('should throw an error if a response schema is defined as an object and the data is invalid', () => {
    const send = jest.fn()
    const context = {
      res: { send },
      schema: {
        response: {
          test: 'string'
        }
      }
    }

    expect(() => { sendWrapper(context)({ test: false }) }).toThrow()
  })

  it('should pass if a response schema is defined as an object and the data is valid', () => {
    const send = jest.fn()
    const context = {
      res: { send },
      schema: {
        response: {
          test: 'string'
        }
      }
    }

    sendWrapper(context)({ test: 'works' })

    expect(send.mock.calls.length).toBe(1)
    expect(send.mock.calls[0][0]).toEqual({ test: 'works' })
  })
})
