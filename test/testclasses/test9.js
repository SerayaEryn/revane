'use strict';

const Controller = require('../../decorators').Controller;

class Test9 {
  doSomething() {
    this.invoked = true;
  }

  addRoutes(router) {
    router.get();
  }

  middleware(req, res, next) {
    next();
  }
}

module.exports = Controller()(Test9);
