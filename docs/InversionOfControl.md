# Inversion of Control

* [Example](#example)
* [Component registration](#component-registration)
  * [via Json file](#json-file)
  * [via Xml file](#xml-file)
  * [via Component Scan](#component-scanning)
* [Dependency Injection](#dependency-injection)
* [Post Construct](#post-construct)
* [Scopes](#scopes)
* [Bean Factory](#bean-factory)

## Example

This is a small example how to create an application with `revane`.

Define a respository:

```js
// ./lib/UserRepository.js
const { Repository } = require('revane');

class UserRepository {
  getUser(id) {
    return { name: 'max' }
  }
};

module.exports = Repository(UserRepository);
```

Define a controller that has a plugin method that defines a fastify plugin and uses the `userRepository` bean:

```js
// ./lib/UserController.js
const { Controller } = require('revane');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  plugin(fastify, options, next) {
    fastify.get('/user/:id', (request, reply) => {
      const { id } = request.params;
      const user = this.userRepository.getUser(id);
      reply.send(JSON.stringify(user));
    });
  }
};

module.exports = Controller(UserController);
```

`revane` requires a bean with the id `configuration` with a `get(key)` method to retrieve the keys `fastify.host` and `fastify.port` (for example the [config](https://www.npmjs.com/package/config) module):

```js
// ./lib/Configuration.js
const { Component } = require('revane');

class Configuration {
  get(key) {
    if (key === 'fastify.host') return 'localhost'
    if (key === 'fastify.port') return '3000'
  }
}

module.exports = Component()(Configuration)
```

Now the application may be started as follows:

```js
// Server.js
const { revane } = require('revane');

revane()
  .basePackage(__dirname)
  .componentScan('./lib')
  .register('userController')
  .initialize()
```

## Component registration

Components may be registered by json file, xml file or by scanning for decorated components.
The class property in the configuration files accepts three different kind of paths:

* Absolute paths starting with `/`
* Paths relative to the `basePackage` starting with `./`
* Names of modules 

Configuration files may be passed with the `configurationFiles` option. The `configurationFiles` requires absolute paths.

### Json File

config.json:
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
revane()
  .basePackage(__dirname)
  .xmlFile('./config.json')
  .initialize()
```

### Xml File

config.xml: 
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
revane()
  .basePackage(__dirname)
  .xmlFile('./config.xml')
  .initialize()
```

### Component Scanning

The component scan scans for decorated classes.

It determines the id, scope and dependencies of the decorated class (if not passed as options to the decorator).
The id of a bean is based on the class name. The dependencies will be determined by the constructor of the class and passed to the constructor at the creation of a bean.

There are several decorators that allow to declare a class as component:

* Component
* Service
* Repository
* Controller

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

module.exports = Controller()(UserRepository);
```

It is possible to configure the component scan in xml files:

```xml
<?xml version="1" encoding="utf-8">

<beans>
  <context:component-scan base-package="."/>
</beans>
```

## Post Construct

If a class has a `postConstruct()` function it will be executed after the creation of the bean.

```js
class Example {
  postConstruct() {
    // do something amazing
  }
}
```

## Tear Down

If a class has a `preDestroy()` function it will be executed when `revane#tearDown()` is being called.

```js
class Example {
  preDestroy() {
    // do something amazing
  }
}
```

## Scopes

There are two possible scopes: `singleton` and `prototype`. If no scope is specified `singleton` will be used.

The scope of a class can be specified by the `Scope` decorator.

```js
const { Scope } = require('revane')

class Example {}

module.exports = Scope('prototype')(Example)
```

### Bean Factory

Beans may be defined by decorating a method, that returns a bean, on a class 
with the `@Bean` decorator.

```ts
import { Bean } from 'revane'

class BeanFactory {
  @Bean
  bean () {
    return aBean
  }
}
```
