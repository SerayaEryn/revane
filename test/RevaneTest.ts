import { test } from 'tap'
import Revane, { revane } from '../src/revane/Revane'
import { join } from 'path'
import * as request from 'request'

test('should run component scan', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan('.')
    .initialize()
  t.ok(revane.getBean('scan1'))
  const scan2 = revane.getBean('scan2')
  t.ok(scan2)
  t.ok(scan2.scan1)
  t.ok(revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
})

test('should run component scan and read file', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan('.')
    .xmlFile('./xml/config.xml')
    .initialize()
  t.ok(revane.getBean('scan1'))
  const scan2 = revane.getBean('scan2')
  t.ok(scan2)
  t.ok(scan2.scan1)
  t.ok(revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
})

test('should run component scan with include filter', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan(
      '.',
      null,
      [ { type: 'regex', regex: '.*' }, { type: 'regex', regex: '.*' }]
    )
    .initialize()
  t.ok(revane.getBean('scan1'))
  const scan2 = revane.getBean('scan2')
  t.ok(scan2)
  t.ok(scan2.scan1)
  t.ok(revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
})

test('should run component scan with exclude filter', async (t) => {
  t.plan(4)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan(
      '.',
      [ { type: 'regex', regex: '.*' }, { type: 'regex', regex: '.*' } ]
    )
    .initialize()
  try {
    revane.getBean('scan1')
  } catch (ignore) {
    t.pass()
  }
  try {
    revane.getBean('scan2')
  } catch (ignore) {
    t.pass()
  }
  try {
    revane.getBean('scan3')
  } catch (ignore) {
    t.pass()
  }
  await revane.tearDown()
  t.pass('tearDown() successful')
})

test('should run component scan absolute path', async (t) => {
  t.plan(5)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan(join(__dirname, '../../testdata'))
    .initialize()
  t.ok(revane.getBean('scan1'))
  const scan2 = revane.getBean('scan2')
  t.ok(scan2)
  t.ok(scan2.scan1)
  t.ok(revane.getBean('scan3'))
  await revane.tearDown()
  t.pass('tearDown() successful')
})

test('should start server', async (t) => {
  t.plan(3)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .xmlFile('./xml/config.xml')
    .register('test')
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      t.error(error)
      t.equals(response.statusCode, 200)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve()
        })
        .catch(reject)
    })
  })
})

test('should call ready handler', async (t) => {
  t.plan(4)

  const revane = new Revane()
  await revane
    .basePackage(join(__dirname, '../../testdata'))
    .xmlFile('./xml/config.xml')
    .register('test')
    .ready(() => t.pass())
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      t.error(error)
      t.equals(response.statusCode, 200)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve()
        })
        .catch(reject)
    })
  })
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
    .initialize()
  const url = 'http://localhost:' + revane.port()
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      t.error(error)
      t.equals(response.statusCode, 500)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve()
        })
        .catch(reject)
    })
  })
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
    .initialize()
  const url = 'http://localhost:' + revane.port() + '/test'
  await new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      t.error(error)
      t.equals(response.statusCode, 404)
      revane.tearDown()
        .then(() => {
          t.pass('tearDown() successful')
          resolve()
        })
        .catch(reject)
    })
  })
})

test('port() should return null if no server was started', async (t) => {
  t.plan(2)

  const app = await revane()
    .basePackage(join(__dirname, '../../testdata'))
    .componentScan('.')
    .initialize()
  t.equals(app.port(), null)
  await app.tearDown()
  t.pass('tearDown() successful')
})
