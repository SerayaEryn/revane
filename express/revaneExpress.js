'use strict';

const express = require('express');
const http = require('http');

module.exports = class RevaneExpress {
  constructor(revane, options) {
    this.revane = revane;
    this.options = options || Object.create(null);
    this.server = express();
    this.server.disable('x-powered-by');
    this.server.disable('etag');
  }

  use(id) {
    const middleware = this.revane.get(id);
    const middlewareOptions = middleware.options || Object.create(null);
    const { path } = middlewareOptions;
    const args = [];
    if (path) {
      args.push(path);
    }
    if (typeof middleware === 'function') {
      args.push(middleware);
    } else {
      args.push(middleware.middleware);
    }
    this.server.use(...args);
    return this;
  }

  useControllers(...ids) {
    const controllers = this.revane.getMultiple(ids);
    const router = createRouterFromControllers(controllers);
    this.server.use(router);
    return this;
  }

  listen(callback) {
    const { port, host } = this.options;
    return new Promise((resolve, reject) => {
      try {
        listen(this.server, port, host, resolve);
      } catch (err) {
        reject(err);
      }
    });
  }
};

function listen(app, port, host, callback) {
  const options = {
    port,
    host
  };
  const server = http.createServer(app);
  server.listen(options, callback);
  app.set('port', server.address().port);
  app.set('server', server);
}

function createRouterFromControllers(controllers) {
  const router = express.Router();
  for (const controller of controllers) {
    controller.addRoutes(router);
  }
  return router;
}
