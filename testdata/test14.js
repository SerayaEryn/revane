'use strict';

module.exports = class Controller {
  constructor() {
    this.options = {path: '/test'};
  }

  middleware(req, res, next) {
    next();
  }
};
