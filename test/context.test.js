'use strict';

const Context = require('../lib/context/Context');
const t = require('tap');
const test = t.test;

test('should register bean (class)', (t) => {
  t.plan(1);

  const beanDefinitions = [
    {
      id: 'test1',
      class: './testclasses/test1',
      scope: 'singleton'
    }
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test1');

  t.ok(bean);
});

test('should register bean and call postConstruct (class)', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {
      id: 'test6',
      class: './testclasses/test6',
      scope: 'singleton'
    }
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test6');

  t.ok(bean);
  t.ok(bean.postConstructed);
});

test('should register bean and call postConstruct (class) (prototype)', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test6', class: './testclasses/test6', scope: 'prototype'}
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test6');

  t.ok(bean);
  t.ok(bean.postConstructed);
});

test('should register bean (object) (prototype)', (t) => {
  t.plan(1);

  const beanDefinitions = [
    {id: 'test3', class: './testclasses/test3', scope: 'prototype'}
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test3');

  t.ok(bean);
});

test('should register bean and call postConstruct (class) (prototype)', (t) => {
  t.plan(3);

  const beanDefinitions = [
    {id: 'test6', class: './testclasses/test6', scope: 'prototype'}
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test6');
  const bean2 = context.get('test6');

  t.ok(bean);
  t.ok(bean.postConstructed);
  t.ok(bean !== bean2);
});

test('should register bean (class + prototype)', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test4', class: './testclasses/test4', scope: 'prototype'}
  ];
  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();
  context.get('test4');

  const bean = context.get('test4');

  t.ok(bean);
  t.strictEqual(2, bean.count);
});

test('should register bean (object)', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test3', class: './testclasses/test3', scope: 'singleton'}
  ];
  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test3');

  t.ok(bean);
  t.strictEqual(bean.test, 'test3');
});

test('Should inject dependencies', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test1', class: './testclasses/test1', scope: 'singleton'},
    {id: 'test2', class: './testclasses/test2', scope: 'singleton', properties: [{ref: 'test1'}]}
  ];
  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test2');

  t.ok(bean);
  t.ok(bean.test1);
});

test('Should inject dependencies - ignore order', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {
      id: 'test1',
      class: './testclasses/test1',
      scope: 'singleton'
    },
    {
      id: 'test2',
      class: './testclasses/test2',
      scope: 'singleton', properties: [{
        value: 'test1'
      }]
    }
  ];
  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test2');

  t.ok(bean);
  t.strictEqual(bean.test1, 'test1');
});

test('', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test2', class: './testclasses/test2', scope: 'singleton', properties: [{ref: 'test1'}]},
    {id: 'test1', class: './testclasses/test1', scope: 'singleton'}
  ];
  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  const bean = context.get('test2');

  t.ok(bean);
  t.ok(bean.test1);
});

test('disallow duplicate definition', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test1', class: './testclasses/test1', scope: 'singleton'},
    {id: 'test1', class: './testclasses/test1', scope: 'singleton'}
  ];
  const options = {
    basePackage: __dirname,
    noRedefinition: true
  };
  const context = new Context(options);

  try {
    context.addBeanDefinitions(beanDefinitions);
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_DEFINED_TWICE');
  }
});

test('disallow unknown scope', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {id: 'test1', class: './testclasses/test1', scope: 'request'}
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);

  try {
    context.initialize();
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_INVALID_SCOPE');
  }
});

test('initialize should fail on error', (t) => {
  t.plan(1);

  const beanDefinitions = [
    {
      id: 'test5',
      class: './testclasses/test5',
      scope: 'prototype'
    },
    {
      id: 'test2',
      class: './testclasses/test2',
      scope: 'prototype',
      properties: [
        {
          ref: 'test5'
        }
      ]
    }
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  try {
    context.get('test2');
  } catch (err) {
    t.ok(err);
  }
});

test('throw error if get on uninitialized context', (t) => {
  t.plan(2);

  const options = {
    dirname: __dirname
  };
  const context = new Context(options);

  try {
    context.get('test2');
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED');
  }
});

test('throw error if getByType on uninitialized context', (t) => {
  t.plan(2);

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);

  try {
    context.getByType('test');
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED');
  }
});

test('throw error if getMultiple on uninitialized context', (t) => {
  t.plan(2);

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);

  try {
    context.getMultiple(['test2']);
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED');
  }
});

test('should throw error if error on post construct', (t) => {
  t.plan(2);

  const beanDefinitions = [
    {
      id: 'test11',
      class: './testclasses/test11',
      scope: 'singleton',
      properties: [
        {
          ref: 'test10'
        }
      ]
    },
    {
      id: 'test10',
      class: './testclasses/test10',
      scope: 'singleton'
    }
  ];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);

  try {
    context.initialize();
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_DEPENDENCY_REGISTER');
  }
});

test('should throw error if not found', (t) => {
  t.plan(2);

  const beanDefinitions = [];

  const options = {
    basePackage: __dirname
  };
  const context = new Context(options);
  context.addBeanDefinitions(beanDefinitions);
  context.initialize();

  try {
    context.get('test');
  } catch (err) {
    t.ok(err);
    t.strictEqual(err.code, 'REV_ERR_NOT_FOUND');
  }
});
