'use strict';

import * as http from 'http';
import * as path from 'path';
import * as test from 'tape-catch';
import RevaneExpress from '../src/express/revaneExpress';
import Revane from '../src/revane';

test('should use router', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config4.json')
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
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config4.json')
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
