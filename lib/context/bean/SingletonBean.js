'use strict';

const Bean = require('./Bean');

class SingletonBean extends Bean {
  constructor(Clazz, entry, isClass, dependencyBeans) {
    super();
    this.type = entry.type;
    this.isClass = isClass;
    const dependencies = dependencyBeans.map((bean) => bean.getInstance());
    this.instance = this.createInstance(Clazz, dependencies);
    if (this.instance.postConstruct)
      this.instance.postConstruct();
  }

  getInstance() {
    return this.instance;
  }
}

SingletonBean.scope = 'singleton';

module.exports = SingletonBean;
