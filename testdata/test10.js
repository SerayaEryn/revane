'use strict';

module.exports = class Test10 {
  postConstruct() {
    throw new Error('Booom');
  }
}