'use strict';

module.exports = class BeanTypeRegistry {
  constructor() {
    this.typesByScope = {};
  }

  register(beanType) {
    this.typesByScope[beanType.scope] = beanType;
  }

  get(scope) {
    return this.typesByScope[scope];
  }
};
