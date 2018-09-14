import beanResolver from './BeanResolver'
import Context from './context/Context'
import NotInitializedError from './NotInitializedError'
import Options from './Options'

import * as flat from 'array.prototype.flat'
export * from './decorators/Decorators'

export default class Revane {
  private options: Options
  private context: Context
  private initialized: boolean = false

  constructor (options: Options) {
    this.options = options
  }

  public async initialize (): Promise<void> {
    this.context = new Context(this.options)
    const beanDefinitions = await beanResolver.getBeanDefinitions(this.options)
    this.context.addBeanDefinitions(flat(beanDefinitions))
    await this.context.initialize()
    this.initialized = true
  }

  public get (id: string): any {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
    return this.context.get(id)
  }

  public has (id: string): boolean {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
    return this.context.has(id)
  }

  public getMultiple (ids: string[]): any[] {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
    return this.context.getMultiple(ids)
  }

  public getByType (type: string): any[] {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
    return this.context.getByType(type)
  }
}
