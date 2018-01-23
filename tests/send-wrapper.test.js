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

  it('should pass the same context as to other schema functions', () => {
    const send = jest.fn()
    const data = { org: 'data' }
    const response = jest.fn(() => data)
    const context = {
      res: { send },
      schema: { response },
      req: true
    }

    sendWrapper(context)(data)

    const { calls } = response.mock

    expect(calls.length).toBe(1)
    expect(calls[0][0].data).toEqual(data)
    expect(calls[0][0].res).toBeTruthy()
    expect(calls[0][0].res.send).toBeTruthy()
    expect(calls[0][0].req).toBeTruthy()
    expect(calls[0][0].struct).toBeTruthy()
    expect(calls[0][0].superstruct).toBeTruthy()
    expect(calls[0][0]._).toBeTruthy()
    expect(calls[0][0].validator).toBeTruthy()
    expect(send.mock.calls.length).toBe(1)
    expect(send.mock.calls[0][0]).toEqual(data)
  })

  it('should alter the response data if schema is a function', () => {
    const send = jest.fn()
    const context = {
      res: { send },
      schema: {
        response ({ data }) {
          data.changed = true
          return data
        }
      }
    }

    sendWrapper(context)({ org: 'data' })

    expect(send.mock.calls.length).toBe(1)
    expect(send.mock.calls[0][0]).toEqual({ org: 'data', changed: true })
  })
})
