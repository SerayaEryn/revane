'use strict';

const Revane = require('..');
const revaneExpress = require('../express');
const t = require('tap');
const test = t.test;

test('should use router', (t) => {
  t.plan(2);

  const options = {
    basePackage: __dirname,
    configurationFiles: [
      __dirname + '/testclasses/json/config4.json'
    ],
    componentScan: true
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const express = {
        Router() {
          return {
            get() {
              t.pass();
            }
          };
        }
      };
      const app = {
        use(router) {
          t.ok(router);
        }
      };
      revaneExpress.addRouter(app, revane, express);
    });
});

test('should use middlewares', (t) => {
  t.plan(1);

  const options = {
    basePackage: __dirname,
    configurationFiles: [
      __dirname + '/testclasses/json/config4.json'
    ],
    componentScan: true
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const app = {
        use(router) {
          t.ok(router);
        }
      };
      revaneExpress.useInOrder(app, revane, ['test9']);
    });
});

test('should use middlewares', (t) => {
  t.plan(1);

  const options = {
    basePackage: __dirname,
    configurationFiles: [
      __dirname + '/testclasses/json/config4.json'
    ],
    componentScan: true
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const app = {
        use(router) {
          t.ok(router);
        }
      };
      revaneExpress.useInOrder(app, revane, ['test12']);
    });
});
