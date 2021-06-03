module.exports = class Test {
  plugin (fastify, opts, next) {
    fastify.get('/', (request, reply) => {
      reply.send(new Error('booom'))
    })
    next()
  }

  errorHandler (error, request, reply) {
    reply.status(500)
    reply.send()
  }

  notFoundHandler (request, reply) {
    reply.status(404)
    reply.send()
  }
}
