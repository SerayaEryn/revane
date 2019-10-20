# revane

[![Build Status](https://travis-ci.org/SerayaEryn/revane.svg?branch=master)](https://travis-ci.org/SerayaEryn/revane)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/revane/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/revane?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/revane.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/revane.svg?style=flat)](https://www.npmjs.com/package/revane)

Framework for building web applications with dependency injection without boilerplate code.

## Example

```js
const { revane } = require('revane')

revane()
  .basePackage(__dirname)
  .componentScan('./app')
  .register('userController')
  .initialize()
```

## Documentation

* [API](https://github.com/SerayaEryn/revane/blob/master/docs/API.md)
* [Inversion of Control](https://github.com/SerayaEryn/revane/blob/master/docs/InversionOfControl.md)
* [Fastify Integration](https://github.com/SerayaEryn/revane/blob/master/docs/FastifyIntegration.md)

## License

[MIT](./LICENSE)