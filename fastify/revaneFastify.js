'use strict';

//const fastify = require('fastify');

/*module.exports = class RevaneFastify {
  constructor(options) {
    this.options = options;
    this.server = fastify();
  }

  use(id) {
    const { revane } = this.options;
    const plugin = revane.get(id);
    if (typeof plugin === 'function') {
      return this.server.register(plugin);
    } else {
      return this.server.register(plugin.plugin, plugin.options);
    }
  }

  listen(callback) {
    const { port, host } = this.options;
    return this.server.listen(port, host, callback);
  }

  close(callback) {
    this.server.close(callback);
  }
};*/
