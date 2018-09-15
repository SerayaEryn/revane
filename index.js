'use strict';

const Revane = require('./bin/src/revane/Revane');

module.exports = Revane.default;
for (const key of Object.keys(Revane)) {
  module.exports[key] = Revane[key];
}