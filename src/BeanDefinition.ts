'use strict'

export default class BeanDefinition {
  public class: string
  public id: string
  public type: string
  public properties: any[]
  public path: string
  public scope: string

  constructor (id: string) {
    this.id = id
  }
}
