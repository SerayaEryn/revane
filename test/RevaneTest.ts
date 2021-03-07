import test from 'ava'
import Revane, { revane } from '../src/revane/Revane'
import { join } from 'path'
import * as request from 'request'

test('should run component scan', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
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
    .basePackage(join(__dirname, '../../testdata'))
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
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .componentScan('.')
    .xmlFile('./xml/config.xml')
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
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .componentScan(
      '.',
      null,
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
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .componentScan(
      '.',
      [ { type: 'regex', regex: '.*' }, { type: 'regex', regex: '.*' } ]
    )
    .initialize()
  try {
    await revane.getBean('scan1')
  } catch (ignore) {
    t.pass()
  }
  try {
    await revane.getBean('scan2')
  } catch (ignore) {
    t.pass()
  }
  try {
    await revane.getBean('scan3')
  } catch (ignore) {
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
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan(join(__dirname, '../../testdata'))
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
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .xmlFile('./xml/config.xml')
    .register('test')
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
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
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .xmlFile('./xml/config.xml')
    .register('test')
    .ready(() => t.pass())
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
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
    .basePackage(join(__dirname, '../../testdata'))
    .jsonFile('./json/config.json')
    .register('test')
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .noRedefinition(false)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
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
    .basePackage(join(__dirname, '../../testdata'))
    .jsonFile('./json/config.json')
    .register('test')
    .registerControllers()
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .silent(true)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port() + '/test'
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
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
    .basePackage(join(__dirname, '../../testdata'))
    .jsonFile('./json/config.json')
    .setErrorHandler('test')
    .setNotFoundHandler('test')
    .silent(true)
    .disableAutoConfiguration()
    .initialize()
  const url = 'http://localhost:' + revane.port() + '/test'
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
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

test('should component scan if configured in xml file', async (t) => {
  t.plan(4)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .disableAutoConfiguration()
    .xmlFile('./xml/config2.xml')
    .initialize()

  t.truthy(await revane.getBean('scan1'))
  const scan2 = await revane.getBean('scan2')
  t.truthy(scan2)
  t.truthy(scan2.scan1)
  t.truthy(await revane.getBean('scan3'))
  process.removeAllListeners('SIGTERM')
  process.removeAllListeners('SIGINT')
})
