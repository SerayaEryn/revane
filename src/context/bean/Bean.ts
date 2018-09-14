export default interface Bean {
  getInstance (): any
  createInstance (Clazz, dependencies): any
  postConstruct (): Promise<any>
}
