'use strict';

import Bean from './Bean';

export default class SingletonBean extends Bean {
  public static scope: string = 'singleton';
  private type;
  private instance;

  constructor(Clazz, entry, isClass, dependencyBeans) {
    super();
    this.type = entry.type;
    this.isClass = isClass;
    const dependencies = dependencyBeans.map((bean) => bean.getInstance());
    this.instance = this.createInstance(Clazz, dependencies);
    if (this.instance.postConstruct)
      this.instance.postConstruct();
  }

  public getInstance() {
    return this.instance;
  }
}
