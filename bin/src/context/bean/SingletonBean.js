"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBean_1 = require("./AbstractBean");
class SingletonBean extends AbstractBean_1.default {
    constructor(Clazz, entry, isClass, dependencyBeans) {
        super();
        this.type = entry.type;
        this.isClass = isClass;
        const dependencies = dependencyBeans.map((bean) => bean.getInstance());
        this.instance = this.createInstance(Clazz, dependencies);
        if (this.instance.postConstruct)
            this.instance.postConstruct();
    }
    getInstance() {
        return this.instance;
    }
}
SingletonBean.scope = 'singleton';
exports.default = SingletonBean;
