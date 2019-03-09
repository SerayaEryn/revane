'use strict';

const Component = require('..').Component;

class Scan1 {
  constructor(scan1) {
    this.scan1 = scan1;
  }
}

exports.default = Component('scan2')(Scan1);
