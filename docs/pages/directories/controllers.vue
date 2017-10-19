<template lang="md">
- consists of `.js` files that are exporting an object with URL's as keys and
  functions/objects as handle functions.
- each file will be watched for changes, routes functions will be updated
  internally

```javascript
module.exports = {
  'GET /one-handler' (request, reply) {
    reply.send({ success: true })
  },

  'GET /middleware': [
    (request, reply, next) {
      next()
    },
    (request, reply) {
      reply.send({ success: true })
    },
  ],

  'GET /desctructured' ({ send, body, log }) {
    log.info(body)
    send{ success: true, body })
  }

  'GET /mixed': [
    (request, reply, next) {
      next()
    },
    ({ next, log }) {
      log.info('in middleware')
      next()
    },
    ({ send }) {
      send({ success: true })
    }
  ]

  'POST /schema': [
    {
      body: {},
      querystring: {},
      params: {},
      response: {}
    },
    ({ next, log }) {
      log.info('in middleware')
      next()
    },
    ({ reply }) => {
      reply.send({ success: true })
    }
  ],

  'PUT /context' ({
    request,  // fastify request object
    reply,    // fastify reply object
    next,     // next callback if in an middleware
    models,   // object of models if model directory exists
    query,    // request.query
    body,     // request.body
    params,   // request.params
    headers,  // request.headers
    send,     // reply.send
    redirect, // reply.redirect
    log       // generic logger (log.info, log.warn, ...)
    // + all models: Post = models.Post
  }) {
    send({ success: true })
  }
}
```
</template>
