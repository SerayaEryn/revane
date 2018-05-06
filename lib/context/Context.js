'use strict';

const Container = require('./Container');
const path = require('path');
const BeanDefinedTwiceError = require('./errors/BeanDefinedTwiceError');
const ContextNotInitializedError = require('./errors/ContextNotInitializedError'); // eslint-disable-line max-len

module.exports = class Context {
  constructor(options) {
    this.options = options;
    this.beanDefinitions = new Map();
  }

  addBeanDefinition(beanDefinition) {
    const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id);
    if (exitingBeanDefininaton && this.options.noRedefinition) {
      throw new BeanDefinedTwiceError(exitingBeanDefininaton.id);
    }
    const newBeanDefinition = {
      id: beanDefinition.id,
      scope: beanDefinition.scope || 'singleton',
      path: this._getPath(beanDefinition),
      properties: beanDefinition.properties || [],
      type: beanDefinition.type
    };
    this.beanDefinitions.set(beanDefinition.id, newBeanDefinition);
  }

  _getPath(beanDefinition) {
    if (!this._isRelative(beanDefinition) || this._isAbsolute(beanDefinition)) {
      return beanDefinition.class;
    }
    return path.join(this.options.basePackage, beanDefinition.class);
  }

  _isAbsolute(beanDefinition) {
    return beanDefinition.class.startsWith('/');
  }

  _isRelative(beanDefinition) {
    return beanDefinition.class.startsWith('.');
  }

  addBeanDefinitions(beanDefinitions) {
    for (const beanDefinition of beanDefinitions) {
      this.addBeanDefinition(beanDefinition);
    }
  }

  initialize() {
    const container = new Container([...this.beanDefinitions.values()]);
    container.initialize();
    this.get = container.get.bind(container);
    this.getByType = container.getByType.bind(container);
    this.beanDefinitions = null;
  }

  get(id) {
    throw new ContextNotInitializedError();
  }

  getMultiple(ids) {
    return ids.map(this.get);
  }

  getByType(type) {
    throw new ContextNotInitializedError();
  }
};
