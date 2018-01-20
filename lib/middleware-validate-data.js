const { struct } = require('superstruct')

module.exports = ({ schema }, options = {}) => {
  const { body, params, query } = schema

  return (req, res, next) => {
    if (body) {
      struct(body)(req.body || {})
    }

    if (params) {
      struct(params)(req.params || {})
    }

    if (query) {
      struct(query)(req.query || {})
    }

    next()
  }
}
