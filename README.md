# revane

[![Build Status](https://travis-ci.org/SerayaEryn/revane.svg?branch=master)](https://travis-ci.org/SerayaEryn/revane)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/revane/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/revane?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/revane.svg)](https://greenkeeper.io/)

Revane is a inversion of control framework inspired by spring.

## Features

* Dependency injection for classes
* Component scanning
* xml and json file configuration

## Table of Content

* [Installation](#installation)
* [Example](#example)
* [Usage](#usage)
  * [Component registration](#component-registration)
    * [via Json file](#json-file)
    * [via Xml file](#xml-file)
    * [via Component Scan](#component-scanning)
  * [Dependency Injection](#dependency-injection)
  * [Post Construct](#post-construct)
  * [Scopes](#scopes)
* [API](#api)

## Installation

```bash
npm install revane --save
```

## Example

```js
//userRepository.js
const { Repository } = require('revane');

class UserRepository {
  getUser(id) {
    return {name: 'max'}
  }
};

module.exports = Repository(UserRepository);

//controller.js
const { Controller } = require('revane');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  addRoutes(router) {
    router.get('/user/:id', (req, res, next) => {
      res.json(this.userRepository.getUser(req.params.id));
    });
  }
};

module.exports = Controller(UserController);

//app.js
const Revane = require('revane');

const options = {
  basePackage: __dirname
};
const revane = new Revane(options);
revane.initialize()
  .then(() => {
    revane.get('userController');
  });
```

## Usage

### Component registration

Components are registered by json file, xml file or by scanning for components.
The class property accepts three different kind of paths:

* Absolute paths starting with `/`
* Relative paths starting with `./`
* Names of modules

#### Json File

```json
[
  {
    "id": "userRepository",
    "class": "./lib/UserRepository"
  },
  {
    "id": "userController",
    "class": "./lib/UserControllre",
    "properties": [{
      "ref": "userRepository"
    }]
  }
]
```

```js
//app.js
const options = {
  basePackage: __dirname,
  configurationFiles: [
    __dirname + '/config.json'
  ]
};
const revane = new Revane(options);
revane.initialize()
```

#### Xml File

```xml
<?xml version="1" encoding="utf-8">
<beans>
  <bean id="userRepository" class="./lib/UserRepository"/>
  <bean id="userController" class="./lib/UserController">
    <ref bean="userRepository"/>
  </bean>
</beans>
```

```js
//app.js
const options = {
  basePackage: __dirname,
  configurationFiles: [
    __dirname + '/config.xml'
  ]
};
const revane = new Revane(options);
revane.initialize()
```

#### Component Scanning

The id of a bean is based on the class name. The dependencies will be determined by the constructor of the class and passed to the constructor at the creation of a bean.

**Note**: The component scan is enabled by default.

**Note**: The `basePackage` option determines which folder will be scanned.

**Note**: The component scan may be deactivated with the `componentScan` option.

```js
//userRepository.js
const { Repository } = require('revane');

class UserRepository {
  getUser(id) {
    return {name: 'max'}
  }
};

module.exports = Repository()(UserRepository);

//controller.js
const { Controller } = require('revane');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  addRoutes(router) {
    router.get('/user/:id', (req, res, next) => {
      res.json(this.userRepository.getUser(req.params.id));
    });
  }
};
```

#### Filters

...

### Dependency Injection

If configuration by json file is used it is possible to inject dependencies to a class by adding a reference or a value object to the `properties`:

```json
[
  {
    "id": "userController",
    "class": "./lib/UserControllre",
    "properties": [
      {"ref": "userRepository"},
      {"value": "hello world"}
    ]
  }
]
```

The xml files work the same way.<br>
If component scanning is used the dependencies defined by the constructor parameters of a class or defined by the options of the decorator are being injected.

### Post Construct

If a class has a `postConstruct` function it will be executed after the creation of the bean.

```js
class Example {
  postConstruct() {
    // do something amazing
  }
}
```

### Scopes

There are two possible scopes: `singleton` and `prototype`. If no scope is specified `singleton` will be used.

## API

### Container

```js
const Revane = require('revane');

const options = {
  basePackage: __dirname
};
const revane = new Revane(options);
revane.initialize()
  .then(() => /*...*/)
```

#### get(id)

Returns the bean for the `id`. Throws an error if no bean with the `id` is found.

#### getMultiple(ids)

Returns multiple beans.

#### initialize()

Initializes the container by reading all configured configuration files and performes the component scan. Returns a Promise.

#### options

##### componentScan

A `boolean` that enables or disables the component scan. Defaults to `true`.

##### basePackage (required)

The base package where the container looks for files.

##### noRedefinition

Prevents the duplicate defininion of beans. If a duplicate definition is found an error will be thrown. Defaults to `true`.

##### configurationFiles

An `array` of absolute paths to configuration files, that provide bean definitions.

##### includeFilters

##### excludeFilters



### Decorators

#### Service, Repository, Controller, Component

Used to declare classes as components to be considered by the component scan.

```js
const { Service } = require('revane');
class Example {}
Service()(Example)
```

**Note**: These are neighter typescript decorators or the proposed ecmascript decorators. They are just functions for now.

##### options

* **id** - the id of the bean
* **dependencies** - the dependencies of the class

```js
Service({id: 'example', dependencies: ['test']})(Example)
```

#### Scope

Adds a scope to a class. Possible values: `singleton`, `prototype`

```js
const { Scope } = require('revane');
class Example {}
Scope('prototype')(Example)
```

## License

[MIT](./LICENSE)