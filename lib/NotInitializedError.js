'use strict';

module.exports = class NotInitializedError extends Error {
  constructor() {
    super('not initialized');
    this.code = 'REV_ERR_NOT_INITIALIZED';
  }
};
