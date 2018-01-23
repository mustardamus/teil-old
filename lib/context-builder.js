const lodash = require('lodash')
const modelsObj = require('./models-object')
const logger = require('./logger')

module.exports = (context = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    const keys = []
    const promises = []

    context.log = logger(options)
    context._ = lodash

    if (!context.models && options.modelsGlob) {
      keys.push('models')
      promises.push(modelsObj(options.modelsGlob))
    }

    Promise.all(promises)
      .then(results => {
        const req = context.req
        const res = context.res

        keys.forEach((keyName, i) => {
          context[keyName] = results[i]
        })

        if (req) {
          context = {
            ...context,
            app: req.app,
            body: req.body,
            cookies: req.cookies,
            params: req.params,
            query: req.query
          }
        }

        if (res) {
          context = {
            ...context,
            appendHeader: res.append.bind(res),
            setCookie: res.cookie.bind(res),
            clearCookie: res.clearCookie.bind(res),
            download: res.download.bind(res),
            getHeader: res.get.bind(res),
            json: res.json.bind(res),
            jsonp: res.jsonp.bind(res),
            redirect: res.redirect.bind(res),
            send: res.send.bind(res),
            sendFile: res.sendFile.bind(res),
            sendStatus: res.sendStatus.bind(res),
            setHeader: res.set.bind(res),
            status: res.status.bind(res)
          }
        }

        if (context.models) {
          Object.keys(context.models).forEach(modelName => {
            context[modelName] = context.models[modelName]
          })
        }

        resolve(context)
      })
      .catch(err => reject(err))
  })
}
