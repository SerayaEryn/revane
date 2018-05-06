'use strict';

const Bean = require('./Bean');

class PrototypeBean extends Bean {
  constructor(clazz, entry, isClass, container) {
    super();
    this.type = entry.type;
    this.clazz = clazz;
    this.isClass = isClass;
    this.container = container;
    this.entry = entry;
  }

  getInstance() {
    const dependencies = this.container.getDependencies(true, this.entry);
    const instance = this.createInstance(this.clazz, dependencies);
    if (instance.postConstruct)
      instance.postConstruct();
    return instance;
  }
}

PrototypeBean.scope = 'prototype';

module.exports = PrototypeBean;
