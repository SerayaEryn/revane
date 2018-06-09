'use strict';

import * as express from 'express';
import { Application } from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';
import Revane from '../revane';

export default class RevaneExpress {
  private server: Application;
  private options;
  private revane: Revane;
  private controllers = [];

  constructor(options?, revane?: Revane) {
    if (revane) {
      this.revane = revane;
    } else {
      this.revane = null;
    }
    this.options = options || Object.create(null);
    this.server = express();
    this.server.disable('x-powered-by');
    this.server.disable('etag');
  }

  public initialize(): Promise<void> {
    if (!this.revane) {
      this.revane = new Revane(this.options.revane);
      return this.revane.initialize();
    } else {
      return Promise.resolve();
    }
  }

  public use(id): RevaneExpress {
    const middleware = this.revane.get(id);

    if (middleware.addRoutes) {
      this.controllers.push(middleware);
    } else {
      if (this.controllers.length > 0) {
        const router = createRouterFromControllers(this.controllers);
        this.server.use(router);
        this.controllers = [];
      }

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
    }
    return this;
  }

  public listen(callback?): Promise<void> {
    if (this.controllers.length > 0) {
      const router = createRouterFromControllers(this.controllers);
      this.server.use(router);
      this.controllers = null;
    }
    const { port, host } = this.options;
    return new Promise((resolve, reject) => {
      try {
        listen(this.server, port, host, resolve);
      } catch (err) {
        reject(err);
      }
    });
  }

  public close(): Promise<void> {
    this.server.get('server').close();
    return Promise.resolve();
  }

  public port(): number {
    return this.server.get('port');
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
