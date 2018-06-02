'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class UnknownEndingError extends Error {
    constructor() {
        super('unsupported file type');
        this.code = 'REV_ERR_UNKNOWN_ENDING';
        Error.captureStackTrace(this, UnknownEndingError);
    }
}
exports.default = UnknownEndingError;
