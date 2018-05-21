'use strict';

const Bean = require('./Bean');

module.exports = class ValueBean extends Bean {
  constructor(value) {
    super();
    this.value = value;
  }

  getInstance() {
    return this.value;
  }
};
