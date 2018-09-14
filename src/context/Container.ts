import BeanDefinition from '../BeanDefinition'
import Bean from './bean/Bean'
import PrototypeBean from './bean/PrototypeBean'
import SingletonBean from './bean/SingletonBean'
import ValueBean from './bean/ValueBean'
import BeanTypeRegistry from './BeanTypeRegistry'
import DependencyNotFoundError from './errors/DependencyNotFoundError'
import DependencyRegisterError from './errors/DependencyRegisterError'
import InvalidScopeError from './errors/InvalidScopeError'
import NotFoundError from './errors/NotFoundError'

export default class Container {
  private entries: BeanDefinition[]
  private beans: Map<string, Bean>
  private beanTypeRegistry: BeanTypeRegistry
  private promises: Array<Promise<any>>

  constructor (entries: BeanDefinition[]) {
    this.entries = entries
    this.beans = new Map()
    this.beanTypeRegistry = new BeanTypeRegistry()
    this.beanTypeRegistry.register(SingletonBean)
    this.beanTypeRegistry.register(PrototypeBean)
    this.promises = []
  }

  public async initialize (): Promise<void> {
    for (const entry of this.entries) {
      if (!this.has(entry.id)) {
        this.registerBean(entry)
      }
    }
    this.clearEntries()
    await Promise.all(this.promises)
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

  private registerBean (entry: BeanDefinition): void {
    const Clazz = this.getClass(entry)
    const bean: Bean = this.createBean(entry, Clazz)
    this.set(entry.id, bean)
    const promise: Promise<void> = bean.postConstruct()
      .catch((error) => {
        throw new DependencyRegisterError(entry.id, error)
      })
    this.promises.push(promise)
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

  private createBean (entry: BeanDefinition, Clazz): Bean {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope)
    if (BeanForScope) {
      return this.createBeanForScope(BeanForScope, entry, Clazz)
    }
    throw new InvalidScopeError(entry.scope)
  }

  private createBeanForScope (BeanForScope, entry, Clazz) {
    const isClazz = this.isClass(Clazz)
    const dependencies = this.getDependencies(isClazz, entry)
    return new BeanForScope(Clazz, entry, isClazz, dependencies)
  }

  private getDependencies (isClass, entry: BeanDefinition): Bean[] {
    if (isClass) {
      return entry.properties.map((property) => {
        return this.getDependecySafe(property, entry.id)
      })
    }
    return []
  }

  private getDependecySafe (property, parentId): Bean {
    if (property.value) {
      return new ValueBean(property.value)
    }
    this.ensureDependencyIsPresent(property, parentId)
    return this.getStrict(property.ref)
  }

  private ensureDependencyIsPresent (property, parentId): void {
    if (!this.hasDependency(property.ref)) {
      this.registerDependency(property.ref, parentId)
    }
  }

  private hasDependency (id: string): boolean {
    return this.has(id)
  }

  private registerDependency (id: string, parentId: string): void {
    try {
      this.findAndRegisterBean(id, parentId)
    } catch (err) {
      this.throwDependencyError(err, id)
    }
  }

  private findAndRegisterBean (id: string, parentId: string): void {
    const entry = this.findEntry(id, parentId)
    this.registerBean(entry)
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
