import test from 'ava'
import Revane, { revane } from '../src/revane/Revane.js'
import { join } from 'node:path'
import request from 'request'

test('should run component scan', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .componentScan('.')
    .disableAutoConfiguration()
    .initialize()
  t.truthy(await revane.getBean('scan1'))
  const scan2 = await revane.getBean('scan2')
  t.truthy(scan2)
  t.truthy(scan2.scan1)
  t.truthy(await revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should run component scan with configuration enabled', async (t) => {
  const instance = revane()
  await instance
    .basePackage(join(import.meta.dirname, '../testdata'))
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .initialize()
  t.truthy(await instance.getBean('scan1'))
  const scan2 = await instance.getBean('scan2')
  const configuration = await instance.getBean('configuration')
  t.truthy(scan2)
  t.truthy(configuration)
  t.truthy(scan2.scan1)
  t.truthy(await instance.getBean('scan3'))
  await instance.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should run component scan and read file', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .disableAutoConfiguration()
    .componentScan('.')
    .xmlFile('../../testdata/xml/config.xml')
    .initialize()
  t.truthy(await revane.getBean('scan1'))
  const scan2 = await revane.getBean('scan2')
  t.truthy(scan2)
  t.truthy(scan2.scan1)
  t.truthy(await revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should run component scan with include filter', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .disableAutoConfiguration()
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .componentScan(
      '.',
      [ { type: 'regex', regex: '.*' }, { type: 'regex', regex: '.*' }]
    )
    .initialize()
  t.truthy(await revane.getBean('scan1'))
  const scan2 = await revane.getBean('scan2')
  t.truthy(scan2)
  t.truthy(scan2.scan1)
  t.truthy(await revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should run component scan with exclude filter', async (t) => {
  t.plan(4)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .disableAutoConfiguration()
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .componentScan(
      '.',
      null,
      [ { type: 'regex', regex: '.*' }, { type: 'regex', regex: '.*' } ]
    )
    .initialize()
  try {
    await revane.getBean('scan1')
  } catch (_) {
    t.pass()
  }
  try {
    await revane.getBean('scan2')
  } catch (_) {
    t.pass()
  }
  try {
    await revane.getBean('scan3')
  } catch (_) {
    t.pass()
  }
  await revane.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should run component scan absolute path', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .componentScan(join(import.meta.dirname, '../testdata'))
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .disableAutoConfiguration()
    .initialize()
  t.truthy(await revane.getBean('scan1'))
  const scan2 = await revane.getBean('scan2')
  t.truthy(scan2)
  t.truthy(scan2.scan1)
  t.truthy(revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should start server', async (t) => {
  t.plan(3)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .disableAutoConfiguration()
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .xmlFile('../../testdata/xml/config.xml')
    .register('test')
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, _) => {
      t.falsy(error)
      t.is(response.statusCode, 200)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve(null)
        })
        .catch(reject)
    })
  })
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should call ready handler', async (t) => {
  t.plan(4)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .disableAutoConfiguration()
    .xmlFile('../../testdata/xml/config.xml')
    .register('test')
    .ready(() => t.pass())
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, _) => {
      t.falsy(error)
      t.is(response.statusCode, 200)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve(null)
        })
        .catch(reject)
    })
  })
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should start server with error handlers #1', async (t) => {
  t.plan(3)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .jsonFile('../../testdata/json/config.json')
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .register('test')
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .noRedefinition(false)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, _) => {
      t.falsy(error)
      t.is(response.statusCode, 500)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve(null)
        })
        .catch(reject)
    })
  })
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should start server with error handlers #2', async (t) => {
  t.plan(3)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .jsonFile('../../testdata/json/config.json')
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .register('test')
    .registerControllers()
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .silent(true)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port() + '/test'
  await new Promise((resolve, reject) => {
    request(url, (error, response, _) => {
      t.falsy(error)
      t.is(response.statusCode, 404)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve(null)
        })
        .catch(reject)
    })
  })
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})

test('should start server with error handlers #3', async (t) => {
  t.plan(3)

  const revane = new Revane()
  await revane
    .basePackage(join(import.meta.dirname, '../testdata'))
    .jsonFile('../../testdata/json/config.json')
    .configurationDir(join(import.meta.dirname, '../../testdata/config'))
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .silent(true)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port() + '/test'
  await new Promise((resolve, reject) => {
    request(url, (error, response, _) => {
      t.falsy(error)
      t.is(response.statusCode, 404)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve(null)
        })
        .catch(reject)
    })
  })
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})
