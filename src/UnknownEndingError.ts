'use strict';

export default class UnknownEndingError extends Error {
  public code: string = 'REV_ERR_UNKNOWN_ENDING';

  constructor() {
    super('unsupported file type');
    Error.captureStackTrace(this, UnknownEndingError);
  }
}
