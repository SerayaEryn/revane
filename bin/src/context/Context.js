"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Container_1 = require("./Container");
const BeanDefinedTwiceError_1 = require("./errors/BeanDefinedTwiceError");
const ContextNotInitializedError_1 = require("./errors/ContextNotInitializedError");
class Context {
    constructor(options) {
        this.initialized = false;
        this.options = options;
        this.beanDefinitions = new Map();
    }
    initialize() {
        this.container = new Container_1.default([...this.beanDefinitions.values()]);
        this.container.initialize();
        this.beanDefinitions = null;
        this.initialized = true;
    }
    addBeanDefinition(beanDefinition) {
        const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id);
        if (exitingBeanDefininaton && this.options.noRedefinition) {
            throw new BeanDefinedTwiceError_1.default(exitingBeanDefininaton.id);
        }
        beanDefinition.scope = beanDefinition.scope || 'singleton',
            beanDefinition.path = this.getPath(beanDefinition),
            beanDefinition.properties = beanDefinition.properties || [],
            beanDefinition.type = beanDefinition.type;
        this.beanDefinitions.set(beanDefinition.id, beanDefinition);
    }
    addBeanDefinitions(beanDefinitions) {
        for (const beanDefinition of beanDefinitions) {
            this.addBeanDefinition(beanDefinition);
        }
    }
    get(id) {
        if (!this.initialized)
            throw new ContextNotInitializedError_1.default();
        return this.container.get(id);
    }
    getMultiple(ids) {
        return ids.map(((id) => this.get(id)));
    }
    getByType(type) {
        if (!this.initialized)
            throw new ContextNotInitializedError_1.default();
        return this.container.getByType(type);
    }
    getPath(beanDefinition) {
        if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
            return beanDefinition.class;
        }
        return path.join(this.options.basePackage, beanDefinition.class);
    }
    isAbsolute(beanDefinition) {
        return beanDefinition.class.startsWith('/');
    }
    isRelative(beanDefinition) {
        return beanDefinition.class.startsWith('.');
    }
}
exports.default = Context;
