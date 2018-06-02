'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Decorator_1 = require("./Decorator");
class Scope extends Decorator_1.default {
    define(Class) {
        const scope = this.options;
        const value = {
            scope
        };
        return this.appendMetaData(Class, value);
    }
}
exports.default = Scope;
