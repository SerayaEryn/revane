'use strict';

module.exports = class NotFoundError extends Error {
  constructor(id) {
    super(`${id} not found`);
    this.code = 'REV_ERR_NOT_FOUND';
    this.id = id;
    Error.captureStackTrace(this, NotFoundError);
  }
};
