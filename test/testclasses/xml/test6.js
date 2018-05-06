'use strict';

module.exports = class Test1 {
  postConstruct() {
    this.postConstructed = true;
  }
}