'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BeanResolver_1 = require("./BeanResolver");
const Context_1 = require("./context/Context");
const NotInitializedError_1 = require("./NotInitializedError");
tslib_1.__exportStar(require("./decorators/Decorators"), exports);
class Revane {
    constructor(options) {
        this.options = options;
    }
    initialize() {
        const context = new Context_1.default(this.options);
        return BeanResolver_1.default.getBeanDefinitions(this.options)
            .then((beanDefinitionResult) => {
            for (const beanDefinitions of beanDefinitionResult) {
                context.addBeanDefinitions(beanDefinitions);
            }
            context.initialize();
            this.get = context.get.bind(context);
            this.getMultiple = context.getMultiple.bind(context);
            this.getByType = context.getByType.bind(context);
        });
    }
    get(id) {
        throw new NotInitializedError_1.default();
    }
    getMultiple(ids) {
        throw new NotInitializedError_1.default();
    }
    getByType(type) {
        throw new NotInitializedError_1.default();
    }
}
exports.default = Revane;
