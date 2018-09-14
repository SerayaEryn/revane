import * as path from 'path'
import BeanDefinition from '../BeanDefinition'
import Options from '../Options'
import Container from './Container'
import BeanDefinedTwiceError from './errors/BeanDefinedTwiceError'
import ContextNotInitializedError from './errors/ContextNotInitializedError'

export default class Context {
  private options: Options
  private beanDefinitions: Map<string, BeanDefinition>
  private container: Container
  private initialized: boolean = false

  constructor (options: Options) {
    this.options = options
    this.beanDefinitions = new Map()
  }

  public async initialize (): Promise<void> {
    this.container = new Container([...this.beanDefinitions.values()])
    await this.container.initialize()
    this.beanDefinitions = null
    this.initialized = true
  }

  public addBeanDefinition (beanDefinition: BeanDefinition): void {
    const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id)
    if (exitingBeanDefininaton && this.options.noRedefinition) {
      throw new BeanDefinedTwiceError(exitingBeanDefininaton.id)
    }
    beanDefinition.scope = beanDefinition.scope || 'singleton',
    beanDefinition.path = this.getPath(beanDefinition),
    beanDefinition.properties = beanDefinition.properties || [],
    beanDefinition.type = beanDefinition.type
    this.beanDefinitions.set(beanDefinition.id, beanDefinition)
  }

  public addBeanDefinitions (beanDefinitions: BeanDefinition[]): void {
    for (const beanDefinition of beanDefinitions) {
      this.addBeanDefinition(beanDefinition)
    }
  }

  public get (id: string): any {
    if (!this.initialized) {
      throw new ContextNotInitializedError()
    }
    return this.container.get(id)
  }

  public getMultiple (ids: string[]): any[] {
    return ids.map(((id: string) => this.get(id)))
  }

  public getByType (type: string): any[] {
    if (!this.initialized) {
      throw new ContextNotInitializedError()
    }
    return this.container.getByType(type)
  }

  private getPath (beanDefinition: BeanDefinition): string {
    if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
      return beanDefinition.class
    }
    return path.join(this.options.basePackage, beanDefinition.class)
  }

  private isAbsolute (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('/')
  }

  private isRelative (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('.')
  }
}
