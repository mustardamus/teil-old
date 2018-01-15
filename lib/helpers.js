const { trim, trimEnd, isBoolean, replace } = require('lodash')

module.exports = {
  makeCleanUrl (url) {
    url = trim(url)

    if (url.charAt(0) !== '/') {
      url = `/${url}`
    }

    url = trimEnd(url, '/')
    url = trim(url)

    if (url.length === 0) {
      url = '/'
    }

    return url
  },

  isAllowedMethod (method) {
    return [
      'DELETE', 'GET', 'HEAD', 'PATCH',
      'POST', 'PUT', 'OPTIONS'
    ].includes(method.toUpperCase())
  },

  objectToCliArgs (obj) {
    let cli = ''

    Object.keys(obj).forEach(keyName => {
      if (isBoolean(obj[keyName])) {
        cli += ` --${keyName}`
      } else {
        cli += ` --${keyName} "${obj[keyName]}"`
      }
    })

    return trim(cli)
  },

  removeCwd (val) {
    const cwd = process.cwd()

    if (val.includes(cwd)) {
      return '.' + replace(val, process.cwd(), '')
    }

    return val
  }
}
