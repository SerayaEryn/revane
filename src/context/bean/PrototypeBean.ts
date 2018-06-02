import AbstractBean from './AbstractBean';

export default class PrototypeBean extends AbstractBean {
  public static scope: string = 'prototype';
  public isClass: boolean;
  private type: string;
  private clazz: string;
  private entry;
  private dependencies: any[];

  constructor(clazz, entry, isClass, dependencies) {
    super();
    this.type = entry.type;
    this.clazz = clazz;
    this.isClass = isClass;
    this.entry = entry;
    this.dependencies = dependencies;
  }

  public getInstance(): any  {
    const dependencies = this.dependencies.map((bean) => bean.getInstance());
    const instance = this.createInstance(this.clazz, dependencies);
    if (instance.postConstruct)
      instance.postConstruct();
    return instance;
  }
}
