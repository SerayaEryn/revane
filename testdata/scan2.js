'use strict';

const Component = require('..').Component;

class Scan1 {
  constructor(test6) {
    this.test6 = test6;
  }
}

exports.default = Component('scan2')(Scan1);
