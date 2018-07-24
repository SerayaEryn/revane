'use strict';

export default class DependencyRegisterError extends Error {
  public code: string = 'REV_ERR_DEPENDENCY_REGISTER';

  constructor(id: string, error: Error) {
    super('Failed to register dependency id=' + id);
    this.stack += '\nCaused by\n';
    this.stack += error.stack;
    Error.captureStackTrace(this, DependencyRegisterError);
  }
}
