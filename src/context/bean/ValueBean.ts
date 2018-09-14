import AbstractBean from './AbstractBean'

export default class ValueBean extends AbstractBean {
  private value: any

  constructor (value: any) {
    super()
    this.value = value
  }

  public getInstance (): any {
    return this.value
  }
}
