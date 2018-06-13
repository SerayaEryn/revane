'use strict';

const Revane = require('./bin/src/Revane');

module.exports = Revane.default;
for (const key of Object.keys(Revane)) {
  module.exports[key] = Revane[key];
}