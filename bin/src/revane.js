"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BeanResolver_1 = require("./BeanResolver");
const Context_1 = require("./context/Context");
const NotInitializedError_1 = require("./NotInitializedError");
tslib_1.__exportStar(require("./decorators/Decorators"), exports);
class Revane {
    constructor(options) {
        this.initialized = false;
        this.options = options;
    }
    initialize() {
        this.context = new Context_1.default(this.options);
        return BeanResolver_1.default.getBeanDefinitions(this.options)
            .then((beanDefinitionResult) => {
            for (const beanDefinitions of beanDefinitionResult) {
                this.context.addBeanDefinitions(beanDefinitions);
            }
            this.context.initialize();
            this.initialized = true;
        });
    }
    get(id) {
        if (!this.initialized)
            throw new NotInitializedError_1.default();
        return this.context.get(id);
    }
    getMultiple(ids) {
        if (!this.initialized)
            throw new NotInitializedError_1.default();
        return this.context.getMultiple(ids);
    }
    getByType(type) {
        if (!this.initialized)
            throw new NotInitializedError_1.default();
        return this.context.getByType(type);
    }
}
exports.default = Revane;
