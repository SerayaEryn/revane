'use strict';

module.exports = class UnknownEndingError extends Error {
  constructor() {
    super('unsupported file type');
    this.code = 'REV_ERR_UNKNOWN_ENDING';
  }
};
