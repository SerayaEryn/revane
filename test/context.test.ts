import * as test from 'tape-catch'
import BeanDefinition from '../src/BeanDefinition'
import Context from '../src/context/Context'

test('should register bean (class)', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../testdata/test1'
  beanDefinition1.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test1')

  t.ok(bean)
})

test('should register bean and call postConstruct (class)', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test6')
  beanDefinition1.class = '../../testdata/test6'
  beanDefinition1.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test6')

  t.ok(bean)
  t.ok(bean.postConstructed)
})

test('should register bean and call postConstruct (class) (prototype)', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test6')
  beanDefinition1.class = '../../testdata/test6'
  beanDefinition1.scope = 'prototype'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test6')

  t.ok(bean)
  t.ok(bean.postConstructed)
})

test('should register bean (object) (prototype)', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test3')
  beanDefinition1.class = '../../testdata/test3'
  beanDefinition1.scope = 'prototype'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test3')

  t.ok(bean)
})

test('should register bean and call postConstruct (class) (prototype)', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test6')
  beanDefinition1.class = '../../testdata/test6'
  beanDefinition1.scope = 'prototype'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test6')
  const bean2 = context.get('test6')

  t.ok(bean)
  t.ok(bean.postConstructed)
  t.ok(bean !== bean2)
})

test('should register bean (class + prototype)', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test4')
  beanDefinition1.class = '../../testdata/test4'
  beanDefinition1.scope = 'prototype'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()
  context.get('test4')

  const bean = context.get('test4')

  t.ok(bean)
  t.strictEqual(2, bean.count)
})

test('should register bean (object)', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test3')
  beanDefinition1.class = '../../testdata/test3'
  beanDefinition1.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test3')

  t.ok(bean)
  t.strictEqual(bean.test, 'test3')
})

test('Should inject dependencies', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../testdata/test1'
  beanDefinition1.scope = 'singleton'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../testdata/test2'
  beanDefinition2.scope = 'singleton'
  beanDefinition2.properties = [{ ref: 'test1' }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test2')

  t.ok(bean)
  t.ok(bean.test1)
})

test('Should inject dependencies - ignore order', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../testdata/test1'
  beanDefinition1.scope = 'singleton'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../testdata/test2'
  beanDefinition2.scope = 'singleton'
  beanDefinition2.properties = [{ value: 'test1' }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test2')

  t.ok(bean)
  t.strictEqual(bean.test1, 'test1')
})

test('Should provide dependency to class', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test2')
  beanDefinition1.class = '../../testdata/test2'
  beanDefinition1.scope = 'singleton'
  beanDefinition1.properties = [{ value: 'test1' }]
  const beanDefinition2 = new BeanDefinition('test1')
  beanDefinition2.class = '../../testdata/test1'
  beanDefinition2.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test2')

  t.ok(bean)
  t.ok(bean.test1)
})

test('disallow duplicate definition', (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../testdata/test1'
  beanDefinition1.scope = 'singleton'
  const beanDefinition2 = new BeanDefinition('test1')
  beanDefinition2.class = '../../testdata/test1'
  beanDefinition2.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname,
    noRedefinition: true
  }
  const context = new Context(options)

  try {
    context.addBeanDefinitions(beanDefinitions)
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_DEFINED_TWICE')
  }
})

test('disallow unknown scope', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../testdata/test1'
  beanDefinition1.scope = 'request'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)

  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_INVALID_SCOPE')
  }
})

test('initialize should fail on error', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test5')
  beanDefinition1.class = '../../testdata/test5'
  beanDefinition1.scope = 'prototype'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../testdata/test2'
  beanDefinition2.scope = 'prototype'
  beanDefinition2.properties = [{
    ref: 'test5'
  }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  try {
    context.get('test2')
  } catch (err) {
    t.ok(err)
  }
})

test('throw error if get on uninitialized context', (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)

  try {
    context.get('test2')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if has on uninitialized context', (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)

  try {
    context.has('test2')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if getByType on uninitialized context', (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)

  try {
    context.getByType('test')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if getMultiple on uninitialized context', (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)

  try {
    context.getMultiple(['test2'])
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('should throw error if error on post construct', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test11')
  beanDefinition1.class = '../../testdata/test11'
  beanDefinition1.scope = 'singleton'
  beanDefinition1.properties = [{
    ref: 'test10'
  }]
  const beanDefinition2 = new BeanDefinition('test10')
  beanDefinition2.class = '../../testdata/test10'
  beanDefinition2.scope = 'singleton'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)

  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_DEPENDENCY_REGISTER')
    t.ok(err.stack.includes('Caused by'))
  }
})

test('should throw error if not found', async (t) => {
  t.plan(2)

  const beanDefinitions = []

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  try {
    context.get('test')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_NOT_FOUND')
  }
})

test('should handle on has()', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test5')
  beanDefinition1.class = '../../testdata/test5'
  beanDefinition1.scope = 'prototype'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../testdata/test2'
  beanDefinition2.scope = 'prototype'
  beanDefinition2.properties = [{
    ref: 'test5'
  }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options)
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  t.ok(context.has('test2'))
  t.ok(context.has('test5'))
  t.notOk(context.has('unknown'))
})
