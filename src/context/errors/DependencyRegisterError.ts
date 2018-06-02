'use strict';

export default class DependencyRegisterError extends Error {
  public code: string = 'REV_ERR_DEPENDENCY_REGISTER';

  constructor(id) {
    super('Failed to register dependency id=' + id);
    Error.captureStackTrace(this, DependencyRegisterError);
  }
}
