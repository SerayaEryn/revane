import * as test from 'tape-catch';
import { Scope, Service } from '../src/revane';

test('should add scope meta data', t => {
  t.plan(1);

  class TestClass {
    public static __componentmeta: any;
  }

  Scope('prototype')(
  TestClass
  );

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
});

test('should add scope meta data', t => {
  t.plan(1);
  class TestClass {
    public static __componentmeta;
  }

  Scope('prototype')(
  TestClass
  );

  t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
});
