'use strict';

const Bean = require('./Bean');

class PrototypeBean extends Bean {
  constructor(clazz, entry, isClass, dependencies) {
    super();
    this.type = entry.type;
    this.clazz = clazz;
    this.isClass = isClass;
    this.entry = entry;
    this.dependencies = dependencies;
  }

  getInstance() {
    const dependencies = this.dependencies.map((bean) => bean.getInstance());
    const instance = this.createInstance(this.clazz, dependencies);
    if (instance.postConstruct)
      instance.postConstruct();
    return instance;
  }
}

PrototypeBean.scope = 'prototype';

module.exports = PrototypeBean;
