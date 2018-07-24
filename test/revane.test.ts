import * as path from 'path';
import * as test from 'tape-catch';
import Revane from '../src/Revane';

test('should read json configuration file and register beans', (t) => {
  t.plan(3);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    componentScan: false,
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json')
    ]
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const bean1 = revane.get('json1');
      const bean2 = revane.get('json2');

      t.ok(bean1);
      t.ok(bean2);
      t.ok(bean2.json1);
    });
});

test('should read json configuration file and register beans', (t) => {
  t.plan(4);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config3.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const bean1 = revane.get('json1');
      const bean2 = revane.get('json2');
      const bean3 = revane.get('json3');

      t.ok(bean1);
      t.ok(bean2);
      t.ok(bean2.json1);
      t.ok(bean3);
    });
});

test('should read json and xml configuration file and register beans', (t) => {
  t.plan(6);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json'),
      path.join(__dirname, '../../testdata/xml/config.xml')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const bean1 = revane.get('json1');
      const bean2 = revane.get('json2');
      const bean3 = revane.get('xml1');
      const bean4 = revane.get('xml2');

      t.ok(bean1);
      t.ok(bean2);
      t.ok(bean2.json1);
      t.ok(bean3);
      t.ok(bean4);
      t.ok(bean4.xml1);
    });
});

test('should create bean for module', (t) => {
  t.plan(1);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/xml/config3.xml')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const bean = revane.get('http');
      t.ok(bean);
    });
});

test('should read not reject on missing paths', (t) => {
  t.plan(1);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      t.pass();
    });
});

test('should read json config file and reject on missing dependency', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config2.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .catch((err) => {
      t.ok(err);
      t.strictEquals(err.code, 'REV_ERR_DEPENDENCY_NOT_FOUND');
    });
});

test('should reject error on unknown configuration file ending', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config2.test')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .catch((err) => {
      t.ok(err);
      t.strictEquals(err.code, 'REV_ERR_UNKNOWN_ENDING');
    });
});

test('should on get if not initialized', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  try {
    revane.get('test');
  } catch (err) {
    t.ok(err);
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED');
  }
});

test('should throw error on getMultiple if not initialized', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  try {
    revane.getMultiple(['test']);
  } catch (err) {
    t.ok(err);
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED');
  }
});

test('should return multiple beans', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const [ json1, json2 ] = revane.getMultiple(['json1', 'json2']);
      t.ok(json1);
      t.ok(json2);
    });
});

test('should on getByType if not initialized', (t) => {
  t.plan(2);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json')
    ],
    componentScan: false
  };
  const revane = new Revane(options);
  try {
    revane.getByType('test');
  } catch (err) {
    t.ok(err);
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED');
  }
});

test('should read json config file, component scan and register beans', (t) => {
  t.plan(4);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json'),
      path.join(__dirname, '../../testdata/xml/config2.xml')
    ]
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const bean1 = revane.get('json1');
      const bean2 = revane.get('json2');
      const bean3 = revane.get('scan1');

      t.ok(bean1);
      t.ok(bean2);
      t.ok(bean2.json1);
      t.ok(bean3);
    });
});

test('should get components', (t) => {
  t.plan(1);

  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    configurationFiles: [
      path.join(__dirname, '../../testdata/json/config.json'),
      path.join(__dirname, '../../testdata/xml/config2.xml')
    ]
  };
  const revane = new Revane(options);
  return revane.initialize()
    .then(() => {
      const beans = revane.getByType('component');

      t.strictEquals(3, beans.length);
    });
});
