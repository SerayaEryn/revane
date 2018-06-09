import * as http from 'http';
import * as path from 'path';
import * as test from 'tape-catch';
import RevaneExpress from '../src/express/revaneExpress';
import Revane from '../src/revane';

test('should use router', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config4.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      t.pass();
      const app = new RevaneExpress(null, revane);
      return app.use('test12')
        .use('test14')
        .use('test13')
        .listen()
        .then(() => {
          t.ok(app.port());
          app.close();
        });
    });
});

test('should use router', (t) => {
  t.plan(2);

  const options = {
    revane: {
      basePackage: path.join(__dirname, '../../testdata'),
      configurationFiles: [
        path.join(__dirname, '../../testdata/json/config4.json')
      ],
      componentScan: false
    }
  };
  const app = new RevaneExpress(options);
  return app.initialize()
    .then(() => {
      t.pass();
      return app.use('test12')
        .use('test14')
        .use('test13')
        .listen()
        .then(() => {
          t.ok(app.port());
          app.close();
        });
    });
});

test('should reject with error', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config4.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      t.pass();
      const app = new RevaneExpress({port: -1}, revane);
      return app.use('test12')
        .use('test13')
        .listen()
        .catch((err) => {
          t.ok(err);
        });
    });
});
