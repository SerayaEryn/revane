'use strict';

module.exports = class Decorator {
  create(options) {
    this.options = options;
    return this.define.bind(this);
  }

  _appendMetaData(Class, meta) {
    const oldMeta = Class.__componentmeta || {};
    const value = Object.assign(oldMeta, meta);
    Object.defineProperty(Class, '__componentmeta', {
      enumerable: false,
      configurable: false,
      writable: false,
      value
    });
    return Class;
  }
};
