'use strict';

import * as test from 'tape-catch';
import { Scope, Service } from '../src/revane';

test('should add scope and service meta data', t => {
  t.plan(3);
  class TestClass {
    public static __componentmeta;
  }

  Scope('prototype')(
  Service()(
  TestClass
  ));

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
  t.strictEquals(TestClass.__componentmeta.id, 'testClass');
  t.deepEquals(TestClass.__componentmeta.dependencies, []);
});

test('should add scope and service meta data', t => {
  t.plan(3);
  class TestClass {
    public static __componentmeta;
  }

  Scope('prototype')(
  Service({id: 'test'})(
  TestClass
  ));

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
  t.strictEquals(TestClass.__componentmeta.id, 'test');
  t.deepEquals(TestClass.__componentmeta.dependencies, []);
});
