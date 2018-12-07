import BeanDefinition from '../BeanDefinition'
import Bean from './bean/Bean'
import ValueBean from './bean/ValueBean'
import DependencyNotFoundError from './errors/DependencyNotFoundError'
import DependencyRegisterError from './errors/DependencyRegisterError'
import InvalidScopeError from './errors/InvalidScopeError'
import NotFoundError from './errors/NotFoundError'
import BeanTypeRegistry from './BeanTypeRegistry'

export default class Container {
  private entries: BeanDefinition[]
  private beans: Map<string, Bean>
  private beanTypeRegistry: BeanTypeRegistry

  constructor (entries: BeanDefinition[], beanTypeRegistry: BeanTypeRegistry) {
    this.entries = entries
    this.beans = new Map()
    this.beanTypeRegistry = beanTypeRegistry
  }

  public async initialize (): Promise<void> {
    for (const entry of this.entries) {
      if (!this.has(entry.id)) {
        await this.registerBean(entry)
      }
    }
    this.clearEntries()
  }

  public get (id: string): any {
    const bean = this.getStrict(id)
    return bean.getInstance()
  }

  public getByType (type): any[] {
    const beansByType = []
    for (const id of Object.keys(this.beans)) {
      if (this.beans[id].type === type) {
        beansByType.push(this.get(id))
      }
    }
    return beansByType
  }

  public has (id: string): boolean {
    return this.beans[id] !== undefined
  }

  private getStrict (id): Bean {
    const bean: Bean = this.beans[id]
    if (!bean) {
      throw new NotFoundError(id)
    }
    return bean
  }

  private async registerBean (entry: BeanDefinition): Promise<void> {
    const Clazz = this.getClass(entry)
    const bean: Bean = await this.createBean(entry, Clazz)
    this.set(entry.id, bean)
    await bean.postConstruct()
      .catch((error) => {
        throw new DependencyRegisterError(entry.id, error)
      })
  }

  private clearEntries (): void {
    this.entries = null
  }

  private set (id: string, bean: Bean): void {
    this.beans[id] = bean
  }

  private getClass (entry: BeanDefinition) {
    const Clazz = require(entry.path)
    if (Clazz.default) {
      return Clazz.default
    }
    return Clazz
  }

  private createBean (entry: BeanDefinition, Clazz): Promise<Bean> {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope)
    if (BeanForScope) {
      return this.createBeanForScope(BeanForScope, entry, Clazz)
    }
    throw new InvalidScopeError(entry.scope)
  }

  private async createBeanForScope (BeanForScope, entry, Clazz): Promise<any> {
    const isClazz = this.isClass(Clazz)
    const dependencies = await this.getDependencies(isClazz, entry)
    return new BeanForScope(Clazz, entry, isClazz, dependencies)
  }

  private async getDependencies (isClass, entry: BeanDefinition): Promise<Bean[]> {
    if (isClass) {
      return Promise.all(entry.properties.map(async (property) => {
        return this.getDependecySafe(property, entry.id)
      }))
    }
    return Promise.resolve([])
  }

  private async getDependecySafe (property, parentId): Promise<Bean> {
    if (property.value) {
      return new ValueBean(property.value)
    }
    await this.ensureDependencyIsPresent(property, parentId)
    return this.getStrict(property.ref)
  }

  private async ensureDependencyIsPresent (property, parentId): Promise<void> {
    if (!this.hasDependency(property.ref)) {
      await this.registerDependency(property.ref, parentId)
    }
  }

  private hasDependency (id: string): boolean {
    return this.has(id)
  }

  private async registerDependency (id: string, parentId: string): Promise<void> {
    try {
      await this.findAndRegisterBean(id, parentId)
    } catch (err) {
      this.throwDependencyError(err, id)
    }
  }

  private async findAndRegisterBean (id: string, parentId: string): Promise<void> {
    const entry = this.findEntry(id, parentId)
    await this.registerBean(entry)
  }

  private throwDependencyError (err: Error, id: string): void {
    if (err instanceof DependencyNotFoundError) {
      throw err
    }
    throw new DependencyRegisterError(id, err)
  }

  private findEntry (id: string, parentId: string): BeanDefinition {
    for (const entry of this.entries) {
      if (entry.id === id) {
        return entry
      }
    }
    throw new DependencyNotFoundError(id, parentId)
  }

  private isClass (Clazz): boolean {
    try {
      Object.defineProperty(Clazz, 'prototype', {
        writable: true
      })
      return false
    } catch (err) {
      return typeof Clazz === 'function'
    }
  }
}
