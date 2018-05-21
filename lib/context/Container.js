'use strict';

const SingletonBean = require('./bean/SingletonBean');
const PrototypeBean = require('./bean/PrototypeBean');
const NotFoundError = require('./errors/NotFoundError');
const DependencyNotFoundError = require('./errors/DependencyNotFoundError');
const DependencyRegisterError = require('./errors/DependencyRegisterError');
const InvalidScopeError = require('./errors/InvalidScopeError');
const BeanTypeRegistry = require('./BeanTypeRegistry');
const ValueBean = require('./bean/ValueBean');

module.exports = class Container {
  constructor(entries) {
    this.entries = entries;
    this.beans = {};
    this.beanTypeRegistry = new BeanTypeRegistry();
    this.beanTypeRegistry.register(SingletonBean);
    this.beanTypeRegistry.register(PrototypeBean);
  }

  initialize() {
    for (const entry of this.entries) {
      if (!this._has(entry.id))
        this._registerBean(entry);
    }
    this._clearEntries();
  }

  get(id) {
    const bean = this._get(id);
    return bean.getInstance();
  }

  getByType(type) {
    const beansByType = [];
    for (const id of Object.keys(this.beans)) {
      if (this.beans[id].type === type)
        beansByType.push(this.get(id));
    }
    return beansByType;
  }

  _get(id) {
    const bean = this.beans[id];
    if (!bean)
      throw new NotFoundError(id);
    return bean;
  }

  _has(id) {
    return this.beans[id] !== undefined;
  }

  _registerBean(entry) {
    var Clazz = this._getClass(entry);
    const bean = this._createBean(entry, Clazz);
    this._set(entry.id, bean);
  }

  _clearEntries() {
    this.entries = null;
  }

  _set(id, bean) {
    this.beans[id] = bean;
  }

  _getClass(entry) {
    return require(entry.path);
  }

  _createBean(entry, Clazz) {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope);
    if (BeanForScope)
      return this._createBeanForScope(BeanForScope, entry, Clazz);
    throw new InvalidScopeError(entry.scope);
  }

  _createBeanForScope(BeanForScope, entry, Clazz) {
    const isClazz = isClass(Clazz);
    const dependencies = this._getDependencies(isClazz, entry);
    return new BeanForScope(Clazz, entry, isClazz, dependencies);
  }

  _getDependencies(isClass, entry) {
    if (isClass) {
      return entry.properties.map((property) => {
        return this._getDependecySafe(property, entry.id);
      });
    }
    return [];
  }

  _getDependecySafe(property, parentId) {
    if (property.value)
      return new ValueBean(property.value);
    this._ensureDependencyIsPresent(property, parentId);
    return this._get(property.ref);
  }

  _ensureDependencyIsPresent(property, parentId) {
    if (!this._hasDependency(property.ref))
      this._registerDependency(property.ref, parentId);
  }

  _hasDependency(id) {
    return this._has(id);
  }

  _registerDependency(id, parentId) {
    try {
      this._findAndRegisterBean(id, parentId);
    } catch (err) {
      this._throwDependencyError(err, id);
    }
  }

  _findAndRegisterBean(id, parentId) {
    const entry = this._findEntry(id, parentId);
    this._registerBean(entry);
  }

  _throwDependencyError(err, id) {
    if (err instanceof DependencyNotFoundError)
      throw err;
    throw new DependencyRegisterError(id);
  }

  _findEntry(id, parentId) {
    for (const entry of this.entries) {
      if (entry.id === id)
        return entry;
    }
    throw new DependencyNotFoundError(id, parentId);
  }
};

function isClass(Clazz) {
  try {
    Object.defineProperty(Clazz, 'prototype', {
      'writable': true
    });
    return false;
  } catch (err) {
    return typeof Clazz === 'function';
  }
}
