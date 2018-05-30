'use strict';

module.exports = class InvalidScopeError extends Error {
  constructor(scope) {
    super('invalid scope: ' + scope);
    this.code = 'REV_ERR_INVALID_SCOPE';
    Error.captureStackTrace(this, InvalidScopeError);
  }
};
