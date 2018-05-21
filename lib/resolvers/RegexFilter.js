'use strict';

module.exports = class RegexFilter {
  constructor(options) {
    this.regex = new RegExp(options.regex);
    this.applies.bind(this);
  }

  applies(entry) {
    return this.regex.test(entry.class);
  }
};
