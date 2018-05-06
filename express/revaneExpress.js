'use strict';

function useInOrder(app, revane, ids) {
  const middlewares = revane.getMultiple(ids);
  for (const middleware of middlewares) {
    if (typeof middleware === 'function') {
      app.use(middleware);
    } else {
      app.use(middleware.middleware);
    }
  }
}

function addRouter(app, revane, express) {
  const controllers = revane.getByType('controller');
  const router = express.Router();
  for (const controller of controllers) {
    if (typeof controller !== 'function') {
      controller.addRoutes(router);
    }
  }
  app.use(router);
}

module.exports = {
  useInOrder,
  addRouter
};
