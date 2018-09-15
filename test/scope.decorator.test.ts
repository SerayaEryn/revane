import 'reflect-metadata'
import * as test from 'tape-catch'
import { Scope } from '../src/revane/Revane'

test('should add scope meta data', t => {
  t.plan(1)

  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
})

test('should add scope meta data', t => {
  t.plan(1)
  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
})
