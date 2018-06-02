import AbstractBean from './AbstractBean';

export default class SingletonBean extends AbstractBean {
  public static scope: string = 'singleton';
  protected isClass: boolean;
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

  public getInstance(): any {
    return this.instance;
  }
}
