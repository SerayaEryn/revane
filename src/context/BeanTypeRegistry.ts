'use strict';

export default class BeanTypeRegistry {
  private typesByScope: Map<string, any>;

  constructor() {
    this.typesByScope = new Map();
  }

  public register(beanType) {
    this.typesByScope[beanType.scope] = beanType;
  }

  public get(scope) {
    return this.typesByScope[scope];
  }
}
