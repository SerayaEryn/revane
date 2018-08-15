'use strict';

const Component = require('..').Component;

class Scan3 {
  constructor(arg) {
    this.arg = arg
  }
}

exports.default = Component({dependencies: ['test6'], id: 'scan3'})(Scan3);
