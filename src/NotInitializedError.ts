'use strict';

export default class NotInitializedError extends Error {
  public code: string = 'REV_ERR_NOT_INITIALIZED';
  constructor() {
    super('not initialized');
    Error.captureStackTrace(this, NotInitializedError);
  }
}
