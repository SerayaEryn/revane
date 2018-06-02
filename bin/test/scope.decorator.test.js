"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape-catch");
const revane_1 = require("../src/revane");
test('should add scope meta data', t => {
    t.plan(1);
    class TestClass {
    }
    revane_1.Scope('prototype')(TestClass);
    t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
});
test('should add scope meta data', t => {
    t.plan(1);
    class TestClass {
    }
    revane_1.Scope('prototype')(TestClass);
    t.strictEquals(TestClass.__componentmeta.scope, 'prototype');
});
