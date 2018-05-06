'use strict';

const Context = require('./lib/context/Context');
const NotInitializedError = require('./lib/NotInitializedError');
const beanResolver = require('./lib/BeanResolver');

module.exports = class Revane {
  constructor(options) {
    this.options = options;
  }

  initialize() {
    const context = new Context(this.options);
    return beanResolver.getBeanDefinitions(this.options)
      .then((beanDefinitionResult) => {
        for (const beanDefinitions of beanDefinitionResult) {
          context.addBeanDefinitions(beanDefinitions);
        }
        context.initialize();
        this.get = context.get.bind(context);
        this.getMultiple = context.getMultiple.bind(context);
        this.getByType = context.getByType.bind(context);
      });
  }

  get(id) {
    throw new NotInitializedError();
  }

  getMultiple(ids) {
    throw new NotInitializedError();
  }

  getByType(type) {
    throw new NotInitializedError();
  }
};
