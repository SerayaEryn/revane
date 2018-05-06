'use strict';

const Service = require('../../decorators').Service;

class Test7 {
  constructor(test6) {
    this.test6 = test6;
  }
}

module.exports = Service()(Test7);