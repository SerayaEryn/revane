'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class ContextNotInitializedError extends Error {
    constructor() {
        super('not initialized');
        this.code = 'REV_ERR_CONTEXT_NOT_INITIALIZED';
        Error.captureStackTrace(this, ContextNotInitializedError);
    }
}
exports.default = ContextNotInitializedError;
