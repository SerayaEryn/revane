import Bean from './bean/Bean'

export default class BeanTypeRegistry {
  private typesByScope: Map<string, any>

  constructor () {
    this.typesByScope = new Map()
  }

  public register (beanType: any): void {
    this.typesByScope[beanType.scope] = beanType
  }

  public get (scope) {
    return this.typesByScope[scope]
  }
}
