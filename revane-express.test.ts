'use strict';

import Revane from '../lib/revane';
const RevaneExpress = require('../express');
import * as test from 'tape-catch';
const http = require('http');

test('should use router', (t) => {
  t.plan(2);

  const options = {
    basePackage: __dirname,
    configurationFiles: [
      __dirname + '/testclasses/json/config4.json'
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      t.pass();
      const app = new RevaneExpress(revane);
      return app.use('test12')
        .use('test14')
        .useControllers('test13')
        .listen()
        .then(() => {
          t.ok(app.server.get('port'));
          app.server.get('server').close();
        });
    });
});

test('should reject with error', (t) => {
  t.plan(2);

  const options = {
    basePackage: __dirname,
    configurationFiles: [
      __dirname + '/testclasses/json/config4.json'
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      t.pass();
      const app = new RevaneExpress(revane, {port: -1});
      return app.use('test12')
        .useControllers('test13')
        .listen()
        .catch((err) => {
          t.ok(err);
        });
    });
});
