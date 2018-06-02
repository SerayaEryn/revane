'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const PrototypeBean_1 = require("./bean/PrototypeBean");
const SingletonBean_1 = require("./bean/SingletonBean");
const ValueBean_1 = require("./bean/ValueBean");
const BeanTypeRegistry_1 = require("./BeanTypeRegistry");
const DependencyNotFoundError_1 = require("./errors/DependencyNotFoundError");
const DependencyRegisterError_1 = require("./errors/DependencyRegisterError");
const InvalidScopeError_1 = require("./errors/InvalidScopeError");
const NotFoundError_1 = require("./errors/NotFoundError");
class Container {
    constructor(entries) {
        this.entries = entries;
        this.beans = new Map();
        this.beanTypeRegistry = new BeanTypeRegistry_1.default();
        this.beanTypeRegistry.register(SingletonBean_1.default);
        this.beanTypeRegistry.register(PrototypeBean_1.default);
    }
    initialize() {
        for (const entry of this.entries) {
            if (!this.has(entry.id))
                this.registerBean(entry);
        }
        this.clearEntries();
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
            throw new NotFoundError_1.default(id);
        return bean;
    }
    has(id) {
        return this.beans[id] !== undefined;
    }
    registerBean(entry) {
        const Clazz = this._getClass(entry);
        const bean = this._createBean(entry, Clazz);
        this._set(entry.id, bean);
    }
    clearEntries() {
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
        throw new InvalidScopeError_1.default(entry.scope);
    }
    _createBeanForScope(BeanForScope, entry, Clazz) {
        const isClazz = this.isClass(Clazz);
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
            return new ValueBean_1.default(property.value);
        this._ensureDependencyIsPresent(property, parentId);
        return this._get(property.ref);
    }
    _ensureDependencyIsPresent(property, parentId) {
        if (!this._hasDependency(property.ref))
            this._registerDependency(property.ref, parentId);
    }
    _hasDependency(id) {
        return this.has(id);
    }
    _registerDependency(id, parentId) {
        try {
            this._findAndRegisterBean(id, parentId);
        }
        catch (err) {
            this._throwDependencyError(err, id);
        }
    }
    _findAndRegisterBean(id, parentId) {
        const entry = this._findEntry(id, parentId);
        this.registerBean(entry);
    }
    _throwDependencyError(err, id) {
        if (err instanceof DependencyNotFoundError_1.default)
            throw err;
        throw new DependencyRegisterError_1.default(id);
    }
    _findEntry(id, parentId) {
        for (const entry of this.entries) {
            if (entry.id === id)
                return entry;
        }
        throw new DependencyNotFoundError_1.default(id, parentId);
    }
    isClass(Clazz) {
        try {
            Object.defineProperty(Clazz, 'prototype', {
                writable: true
            });
            return false;
        }
        catch (err) {
            return typeof Clazz === 'function';
        }
    }
}
exports.default = Container;
