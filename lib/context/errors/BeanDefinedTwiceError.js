'use strict';

module.exports = class BeanDefinedTwiceError extends Error {
  constructor(id) {
    super(`bean ${id} defined twice`);
    this.code = 'REV_ERR_DEFINED_TWICE';
    Error.captureStackTrace(this, BeanDefinedTwiceError);
  }
};
