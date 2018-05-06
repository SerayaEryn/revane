'use strict';

const Decorator = require('./Decorator');

module.exports = class Scope extends Decorator {
  define(Class) {
    const scope = this.options;
    const value = {
      scope
    };
    return this._appendMetaData(Class, value);
  }
};
