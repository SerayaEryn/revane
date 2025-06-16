import bench from 'fastbench'
import { Revane } from '../bin/src/revane/Revane.js'
import { join } from 'path'

function benchmark () {
  return new Promise((resolve) => {
    const run = bench([
      function startup (cb) {
        const revane = new Revane()
        revane
          .basePackage(join(import.meta.dirname, '../bin/testdata'))
          .jsonFile('../testdata/json/config.json')
          .configurationDir(join(import.meta.dirname, '../testdata/config'))
          .register('test')
          .setErrorHandler('test')
          .setNotFoundHandler('test')
          .noRedefinition(false)
          .disableAutoConfiguration()
          .initialize()
          .then(() => {
            revane.tearDown().then(() => {
              cb()
            })
          })
      }
    ], 10000)
    console.log('\nChild Child Logging:\n')
    run(resolve)
  })
}
benchmark()