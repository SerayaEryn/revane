'use strict'

module.exports = class Configuration {
  get (key) {
    if (key === 'fastify.port') return '0'
    if (key === 'fastify.host') return 'localhost'
  }
}