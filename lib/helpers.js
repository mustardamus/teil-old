const { trim, trimEnd } = require('lodash')

module.exports = {
  makeCleanUrl (url) {
    url = trim(url)

    if (url.charAt(0) !== '/') {
      url = `/${url}`
    }

    url = trimEnd(url, '/')
    url = trim(url)

    return url
  },

  isAllowedMethod (method) {
    return [
      'DELETE', 'GET', 'HEAD', 'PATCH',
      'POST', 'PUT', 'OPTIONS'
    ].includes(method.toUpperCase())
  }
}
