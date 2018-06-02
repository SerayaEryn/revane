"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBean_1 = require("./AbstractBean");
class PrototypeBean extends AbstractBean_1.default {
    constructor(clazz, entry, isClass, dependencies) {
        super();
        this.type = entry.type;
        this.clazz = clazz;
        this.isClass = isClass;
        this.entry = entry;
        this.dependencies = dependencies;
    }
    getInstance() {
        const dependencies = this.dependencies.map((bean) => bean.getInstance());
        const instance = this.createInstance(this.clazz, dependencies);
        if (instance.postConstruct)
            instance.postConstruct();
        return instance;
    }
}
PrototypeBean.scope = 'prototype';
exports.default = PrototypeBean;
