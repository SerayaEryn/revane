export default interface Bean {
  getInstance (): any
  postConstruct (): Promise<any>
}
