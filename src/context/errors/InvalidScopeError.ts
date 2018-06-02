'use strict';

export default class InvalidScopeError extends Error {
public code: string = 'REV_ERR_INVALID_SCOPE';

  constructor(scope) {
    super('invalid scope: ' + scope);
    Error.captureStackTrace(this, InvalidScopeError);
  }
}
