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
  }
}
