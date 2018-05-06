'use strict';

module.exports = class ContextNotInitializedError extends Error {
  constructor() {
    super('not initialized');
    this.code = 'REV_ERR_CONTEXT_NOT_INITIALIZED';
  }
};
