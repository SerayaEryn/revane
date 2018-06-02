'use strict';

import BeanDefinition from '../BeanDefinition';
import Bean from './bean/Bean';
import PrototypeBean from './bean/PrototypeBean';
import SingletonBean from './bean/SingletonBean';
import ValueBean from './bean/ValueBean';
import BeanTypeRegistry from './BeanTypeRegistry';
import DependencyNotFoundError from './errors/DependencyNotFoundError';
import DependencyRegisterError from './errors/DependencyRegisterError';
import InvalidScopeError from './errors/InvalidScopeError';
import NotFoundError from './errors/NotFoundError';

export default class Container {
  private entries: BeanDefinition[];
  private beans: Map<string, Bean>;
  private beanTypeRegistry: BeanTypeRegistry;

  constructor(entries: BeanDefinition[]) {
    this.entries = entries;
    this.beans = new Map();
    this.beanTypeRegistry = new BeanTypeRegistry();
    this.beanTypeRegistry.register(SingletonBean);
    this.beanTypeRegistry.register(PrototypeBean);
  }

  public initialize(): void {
    for (const entry of this.entries) {
      if (!this.has(entry.id))
        this.registerBean(entry);
    }
    this.clearEntries();
  }

  public get(id: string) {
    const bean = this._get(id);
    return bean.getInstance();
  }

  public getByType(type) {
    const beansByType = [];
    for (const id of Object.keys(this.beans)) {
      if (this.beans[id].type === type)
        beansByType.push(this.get(id));
    }
    return beansByType;
  }

  private _get(id): Bean {
    const bean = this.beans[id];
    if (!bean)
      throw new NotFoundError(id);
    return bean;
  }

  private has(id: string): boolean {
    return this.beans[id] !== undefined;
  }

  private registerBean(entry): void {
    const Clazz = this._getClass(entry);
    const bean = this._createBean(entry, Clazz);
    this._set(entry.id, bean);
  }

  private clearEntries(): void {
    this.entries = null;
  }

  private _set(id: string, bean: Bean): void {
    this.beans[id] = bean;
  }

  private _getClass(entry) {
    return require(entry.path);
  }

  private _createBean(entry, Clazz) {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope);
    if (BeanForScope)
      return this._createBeanForScope(BeanForScope, entry, Clazz);
    throw new InvalidScopeError(entry.scope);
  }

  private _createBeanForScope(BeanForScope, entry, Clazz) {
    const isClazz = this.isClass(Clazz);
    const dependencies = this._getDependencies(isClazz, entry);
    return new BeanForScope(Clazz, entry, isClazz, dependencies);
  }

  private _getDependencies(isClass, entry) {
    if (isClass) {
      return entry.properties.map((property) => {
        return this._getDependecySafe(property, entry.id);
      });
    }
    return [];
  }

  private _getDependecySafe(property, parentId) {
    if (property.value)
      return new ValueBean(property.value);
    this._ensureDependencyIsPresent(property, parentId);
    return this._get(property.ref);
  }

  private _ensureDependencyIsPresent(property, parentId) {
    if (!this._hasDependency(property.ref))
      this._registerDependency(property.ref, parentId);
  }

  private _hasDependency(id) {
    return this.has(id);
  }

  private _registerDependency(id, parentId) {
    try {
      this._findAndRegisterBean(id, parentId);
    } catch (err) {
      this._throwDependencyError(err, id);
    }
  }

  private _findAndRegisterBean(id, parentId) {
    const entry = this._findEntry(id, parentId);
    this.registerBean(entry);
  }

  private _throwDependencyError(err, id) {
    if (err instanceof DependencyNotFoundError)
      throw err;
    throw new DependencyRegisterError(id);
  }

  private _findEntry(id, parentId) {
    for (const entry of this.entries) {
      if (entry.id === id)
        return entry;
    }
    throw new DependencyNotFoundError(id, parentId);
  }

  private isClass(Clazz) {
    try {
      Object.defineProperty(Clazz, 'prototype', {
        writable: true
      });
      return false;
    } catch (err) {
      return typeof Clazz === 'function';
    }
  }
}
