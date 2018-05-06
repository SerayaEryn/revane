'use strict';

const Component = require('../../decorators').Component;

class Scan1 {
  constructor(test6) {
    this.test6 = test6;
  }
}

module.exports = Component()(Scan1);
