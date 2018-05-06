'use strict';

module.exports = class Bean {
  createInstance(Clazz, dependencies) {
    if (this.isClass) {
      return new Clazz(...dependencies);
    } else {
      return Clazz;
    }
  }
};
