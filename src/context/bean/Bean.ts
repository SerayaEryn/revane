export default interface Bean {
  getInstance(): any;
  createInstance(Clazz, dependencies);
  postConstruct(): Promise<any>;
}
