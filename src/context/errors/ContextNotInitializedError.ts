'use strict';

export default class ContextNotInitializedError extends Error {
  public code: string = 'REV_ERR_CONTEXT_NOT_INITIALIZED';

  constructor() {
    super('not initialized');
    Error.captureStackTrace(this, ContextNotInitializedError);
  }
}
