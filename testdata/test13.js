'use strict';

module.exports = class Controller {
  addRoutes(router) {
    router.get('/', (req, res, next) => {
      res.send('success');
    });
  }
};
