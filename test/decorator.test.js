'use strict';

const { Scope, Service } = require('../decorators/Decorators');
const t = require('tap');
const test = t.test;


test('should add scope meta data', t => {
  t.plan(1)
  class TestClass {}

  Scope('prototype')(
  TestClass
  );

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
});

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service()(
  TestClass
  ));

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
  t.strictEquals(TestClass.__componentmeta.id, 'testClass');
  t.deepEquals(TestClass.__componentmeta.dependencies, []);
});

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service({id: 'test'})(
  TestClass
  ));

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
  t.strictEquals(TestClass.__componentmeta.id, 'test');
  t.deepEquals(TestClass.__componentmeta.dependencies, []);
});

