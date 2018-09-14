import 'reflect-metadata'
import * as test from 'tape-catch'
import { Scope, Service } from '../src/Revane'

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service()(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata('id', TestClass), 'testClass')
  t.deepEquals(Reflect.getMetadata('dependencies', TestClass), [])
})

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service({ id: 'test' })(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata('id', TestClass), 'test')
  t.deepEquals(Reflect.getMetadata('dependencies', TestClass), [])
})
