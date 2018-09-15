import BeanLoader from './BeanLoader'
import Context from './context/Context'
import Options from './Options'

import * as flat from 'array.prototype.flat'
import BeanTypeRegistry from './context/BeanTypeRegistry'

export default class RevaneCore {
  protected options: Options
  private context: Context
  private beanTypeRegistry: BeanTypeRegistry

  constructor (options: Options, beanTypeRegistry: BeanTypeRegistry) {
    this.options = options
    this.beanTypeRegistry = beanTypeRegistry
  }

  public async initialize (): Promise<void> {
    this.context = new Context(this.options, this.beanTypeRegistry)
    const beanLoader = new BeanLoader()
    const beanDefinitions = await beanLoader.getBeanDefinitions(this.options)
    this.context.addBeanDefinitions(flat(beanDefinitions))
    await this.context.initialize()
  }

  public get (id: string): any {
    return this.context.get(id)
  }

  public has (id: string): boolean {
    return this.context.has(id)
  }

  public getMultiple (ids: string[]): any[] {
    return this.context.getMultiple(ids)
  }

  public getByType (type: string): any[] {
    return this.context.getByType(type)
  }
}
