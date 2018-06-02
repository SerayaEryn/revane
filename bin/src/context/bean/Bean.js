"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bean {
    createInstance(Clazz, dependencies) {
        if (this.isClass) {
            return new Clazz(...dependencies);
        }
        else {
            return Clazz;
        }
    }
}
exports.default = Bean;
