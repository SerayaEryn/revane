'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class DependencyRegisterError extends Error {
    constructor(id) {
        super('Failed to register dependency id=' + id);
        this.code = 'REV_ERR_DEPENDENCY_REGISTER';
        Error.captureStackTrace(this, DependencyRegisterError);
    }
}
exports.default = DependencyRegisterError;
