import * as path from 'path';
import * as test from 'tape-catch';
import ComponentScanResolver from '../src/resolvers/ComponentScanResolver';

test('should do component scan without filters', (t) => {
  t.plan(10);

  const options = {
    basePackage: path.join(__dirname, '../../testdata')
  };

  const componentScanResolver = new ComponentScanResolver(options);
  return componentScanResolver.resolve()
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 5);
      const scan1 = findDefinition(beanDefinitions, 'scan1');
      t.strictEquals(scan1.scope, 'singleton');
      const scan2 = findDefinition(beanDefinitions, 'scan2');
      t.strictEquals(scan2.scope, 'singleton');
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
    })
    .catch((err) => t.error(err));
});

test('should do component scan with exclude filter', (t) => {
  t.plan(1);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
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
    basePackage: path.join(__dirname, '../../testdata'),
    includeFilters: [{
      type: 'regex',
      regex: '.*'
    }]
  };

  const componentScanResolver = new ComponentScanResolver(options);
  return componentScanResolver.resolve()
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 5);
    })
    .catch((err) => t.err(err));
});

function findDefinition(definitions, name) {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition;
    }
  }
  throw new Error();
}
