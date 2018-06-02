'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const BeanDefinition_1 = require("../BeanDefinition");
const Container_1 = require("./Container");
const BeanDefinedTwiceError_1 = require("./errors/BeanDefinedTwiceError");
const ContextNotInitializedError_1 = require("./errors/ContextNotInitializedError");
class Context {
    constructor(options) {
        this.options = options;
        this.beanDefinitions = new Map();
    }
    initialize() {
        const container = new Container_1.default([...this.beanDefinitions.values()]);
        container.initialize();
        this.get = container.get.bind(container);
        this.getByType = container.getByType.bind(container);
        this.beanDefinitions = null;
    }
    addBeanDefinition(beanDefinition) {
        const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id);
        if (exitingBeanDefininaton && this.options.noRedefinition) {
            throw new BeanDefinedTwiceError_1.default(exitingBeanDefininaton.id);
        }
        const newBeanDefinition = new BeanDefinition_1.default(beanDefinition.id);
        newBeanDefinition.scope = beanDefinition.scope || 'singleton',
            newBeanDefinition.path = this.getPath(beanDefinition),
            newBeanDefinition.properties = beanDefinition.properties || [],
            newBeanDefinition.type = beanDefinition.type;
        this.beanDefinitions.set(beanDefinition.id, newBeanDefinition);
    }
    addBeanDefinitions(beanDefinitions) {
        for (const beanDefinition of beanDefinitions) {
            this.addBeanDefinition(beanDefinition);
        }
    }
    get(id) {
        throw new ContextNotInitializedError_1.default();
    }
    getMultiple(ids) {
        return ids.map(this.get);
    }
    getByType(type) {
        throw new ContextNotInitializedError_1.default();
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
