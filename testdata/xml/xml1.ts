export default class Xml1 {
  plugin (fastify, opts, next) {
    fastify.get('/', (request, reply) => {
      reply.status(200)
      reply.send('hello world')
    })
    next()
  }
}
