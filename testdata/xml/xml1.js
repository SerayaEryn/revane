'use strict';

module.exports = class Json1 {
  plugin(fastify, opts, next) {
    fastify.get('/', (request, reply) => {
      reply.status(200)
      reply.send('hello world')
    })
    next()
  }
}