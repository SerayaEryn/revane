'use strict';

let count = 0;

module.exports = class Test4 {
  constructor() {
    count++;
    this.count = count;
  }
}