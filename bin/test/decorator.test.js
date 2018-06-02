'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape-catch");
const revane_1 = require("../src/revane");
test('should add scope and service meta data', t => {
    t.plan(3);
    class TestClass {
    }
    revane_1.Scope('prototype')(revane_1.Service()(TestClass));
    t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
    t.strictEquals(TestClass.__componentmeta.id, 'testClass');
    t.deepEquals(TestClass.__componentmeta.dependencies, []);
});
test('should add scope and service meta data', t => {
    t.plan(3);
    class TestClass {
    }
    revane_1.Scope('prototype')(revane_1.Service({ id: 'test' })(TestClass));
    t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
    t.strictEquals(TestClass.__componentmeta.id, 'test');
    t.deepEquals(TestClass.__componentmeta.dependencies, []);
});
