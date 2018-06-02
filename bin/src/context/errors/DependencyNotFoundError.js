'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class DependencyNotFoundError extends Error {
    constructor(id, parentId) {
        super(`Dependency id=${id} for bean id=${parentId} not found`);
        this.code = 'REV_ERR_DEPENDENCY_NOT_FOUND';
        Error.captureStackTrace(this, DependencyNotFoundError);
    }
}
exports.default = DependencyNotFoundError;
