const { join } = require('path')
const { isFunction } = require('lodash')
const express = require('express')
const request = require('supertest')
const routerBuilder = require('../lib/router-builder')

const controllersGlob = join(__dirname, 'fixtures/controllers/export-single-function.js')

describe('Router Builder', () => {
  it('should build an express router out of the controllers', () => {
    return routerBuilder({ controllersGlob }).then(router => {
      expect(isFunction(router)).toBe(true)
      expect(isFunction(router.get)).toBe(true)

      const app = express()

      app.use('/api', router)

      request(app)
        .get('/api/export-single-function')
        .expect(200)
        .end((err, res) => {
          expect(err).toBeFalsy()
          expect(res.body).toEqual({ success: true })
        })
    })
  })
})
