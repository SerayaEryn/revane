import Bean from './Bean'

export default class ValueBean implements Bean {
  private value: any

  constructor (value: any) {
    this.value = value
  }

  public getInstance (): any {
    return this.value
  }

  public postConstruct (): Promise<any> {
    return Promise.resolve()
  }
}
