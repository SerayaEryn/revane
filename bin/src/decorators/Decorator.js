'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Decorator {
    create(options) {
        this.options = options;
        return this.define.bind(this);
    }
    appendMetaData(Class, meta) {
        const oldMeta = Class.__componentmeta || {};
        const value = Object.assign(oldMeta, meta);
        Object.defineProperty(Class, '__componentmeta', {
            configurable: false,
            enumerable: false,
            value,
            writable: false
        });
        return Class;
    }
}
exports.default = Decorator;
