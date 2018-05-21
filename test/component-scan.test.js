'use strict';

const ComponentScanResolver = require('../lib/resolvers/ComponentScanResolver');
const t = require('tap');
const test = t.test;

test('should do component scan without filters', (t) => {
  t.plan(9);

  const options = {
    basePackage: __dirname
  };

  const componentScanResolver = new ComponentScanResolver(options);
  return componentScanResolver.resolve()
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 4);
      const scan1 = findDefinition(beanDefinitions, 'scan1');
      t.strictEquals(scan1.scope, 'singleton');
      t.deepEquals(scan1.properties, [{ref: 'test6'}]);
      const test7 = findDefinition(beanDefinitions, 'test7');
      t.strictEquals(test7.scope, 'singleton');
      t.deepEquals(test7.properties, [{ref: 'test6'}]);
      const test8 = findDefinition(beanDefinitions, 'test8');
      t.strictEquals(test8.scope, 'singleton');
      t.deepEquals(test8.properties, [{ref: 'test6'}]);
      const test9 = findDefinition(beanDefinitions, 'test9');
      t.strictEquals(test9.scope, 'singleton');
      t.deepEquals(test9.properties, []);
    });
});

test('should do component scan with exclude filter', (t) => {
  t.plan(1);

  const options = {
    basePackage: __dirname,
    excludeFilters: [{
      type: 'regex',
      regex: '.*'
    }]
  };

  const componentScanResolver = new ComponentScanResolver(options);
  return componentScanResolver.resolve()
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 0);
    });
});

test('should do component scan with include filter', (t) => {
  t.plan(1);

  const options = {
    basePackage: __dirname,
    includeFilters: [{
      type: 'regex',
      regex: '.*'
    }]
  };

  const componentScanResolver = new ComponentScanResolver(options);
  return componentScanResolver.resolve()
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 4);
    });
});

function findDefinition(definitions, name) {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition;
    }
  }
  throw new Error();
}
