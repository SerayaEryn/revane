'use strict';

const Service = require('../../decorators').Service;

class Test8 {
  doSomething() {
    this.invoked = true;
  }

  constructor(test6) {
    this.test6 = test6;
  }
}

module.exports = Service()(Test8);