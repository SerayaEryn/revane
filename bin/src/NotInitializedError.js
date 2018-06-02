'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class NotInitializedError extends Error {
    constructor() {
        super('not initialized');
        this.code = 'REV_ERR_NOT_INITIALIZED';
        Error.captureStackTrace(this, NotInitializedError);
    }
}
exports.default = NotInitializedError;
