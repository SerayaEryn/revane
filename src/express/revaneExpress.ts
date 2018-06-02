'use strict';

import * as express from 'express';
import { Application } from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';
import Revane from '../revane';

export default class RevaneExpress {
  public server: Application;
  private options;
  private revane: Revane;

  constructor(revane, options?) {
    this.revane = revane;
    this.options = options || Object.create(null);
    this.server = express();
    this.server.disable('x-powered-by');
    this.server.disable('etag');
  }

  public use(id): RevaneExpress {
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

  public useControllers(...ids): RevaneExpress {
    const controllers = this.revane.getMultiple(ids);
    const router = createRouterFromControllers(controllers);
    this.server.use(router);
    return this;
  }

  public listen(callback?): Promise<void> {
    const { port, host } = this.options;
    return new Promise((resolve, reject) => {
      try {
        listen(this.server, port, host, resolve);
      } catch (err) {
        reject(err);
      }
    });
  }
}

function listen(app, port, host, callback) {
  const options = {
    port,
    host
  };
  const server = http.createServer(app);
  server.listen(options, callback);
  const address: any = server.address();
  app.set('port', address.port);
  app.set('server', server);
}

function createRouterFromControllers(controllers) {
  const router = express.Router();
  for (const controller of controllers) {
    controller.addRoutes(router);
  }
  return router;
}
