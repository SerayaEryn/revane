'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class BeanDefinedTwiceError extends Error {
    constructor(id) {
        super(`bean ${id} defined twice`);
        this.code = 'REV_ERR_DEFINED_TWICE';
        Error.captureStackTrace(this, BeanDefinedTwiceError);
    }
}
exports.default = BeanDefinedTwiceError;
