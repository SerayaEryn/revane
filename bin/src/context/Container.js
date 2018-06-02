"use strict";
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
        const bean = this.getStrict(id);
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
    getStrict(id) {
        const bean = this.beans[id];
        if (!bean)
            throw new NotFoundError_1.default(id);
        return bean;
    }
    has(id) {
        return this.beans[id] !== undefined;
    }
    registerBean(entry) {
        const Clazz = this.getClass(entry);
        const bean = this.createBean(entry, Clazz);
        this.set(entry.id, bean);
    }
    clearEntries() {
        this.entries = null;
    }
    set(id, bean) {
        this.beans[id] = bean;
    }
    getClass(entry) {
        return require(entry.path);
    }
    createBean(entry, Clazz) {
        const BeanForScope = this.beanTypeRegistry.get(entry.scope);
        if (BeanForScope)
            return this.createBeanForScope(BeanForScope, entry, Clazz);
        throw new InvalidScopeError_1.default(entry.scope);
    }
    createBeanForScope(BeanForScope, entry, Clazz) {
        const isClazz = this.isClass(Clazz);
        const dependencies = this.getDependencies(isClazz, entry);
        return new BeanForScope(Clazz, entry, isClazz, dependencies);
    }
    getDependencies(isClass, entry) {
        if (isClass) {
            return entry.properties.map((property) => {
                return this.getDependecySafe(property, entry.id);
            });
        }
        return [];
    }
    getDependecySafe(property, parentId) {
        if (property.value)
            return new ValueBean_1.default(property.value);
        this.ensureDependencyIsPresent(property, parentId);
        return this.getStrict(property.ref);
    }
    ensureDependencyIsPresent(property, parentId) {
        if (!this.hasDependency(property.ref))
            this.registerDependency(property.ref, parentId);
    }
    hasDependency(id) {
        return this.has(id);
    }
    registerDependency(id, parentId) {
        try {
            this.findAndRegisterBean(id, parentId);
        }
        catch (err) {
            this.throwDependencyError(err, id);
        }
    }
    findAndRegisterBean(id, parentId) {
        const entry = this.findEntry(id, parentId);
        this.registerBean(entry);
    }
    throwDependencyError(err, id) {
        if (err instanceof DependencyNotFoundError_1.default)
            throw err;
        throw new DependencyRegisterError_1.default(id);
    }
    findEntry(id, parentId) {
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
