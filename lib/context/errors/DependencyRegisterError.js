'use strict';

module.exports = class DependencyRegisterError extends Error {
  constructor(id) {
    super('Failed to register dependency id=' + id);
    this.code = 'REV_ERR_DEPENDENCY_REGISTER';
    Error.captureStackTrace(this, DependencyRegisterError);
  }
};
