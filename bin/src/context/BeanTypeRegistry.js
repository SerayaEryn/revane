'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class BeanTypeRegistry {
    constructor() {
        this.typesByScope = new Map();
    }
    register(beanType) {
        this.typesByScope[beanType.scope] = beanType;
    }
    get(scope) {
        return this.typesByScope[scope];
    }
}
exports.default = BeanTypeRegistry;
