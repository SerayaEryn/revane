'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(id) {
        super(`${id} not found`);
        this.code = 'REV_ERR_NOT_FOUND';
        this.id = id;
        Error.captureStackTrace(this, NotFoundError);
    }
}
exports.default = NotFoundError;
