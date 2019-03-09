# Fastify Integration Example

To add a plugin to the `fastify` server follow the following steps:

* Define a class with a method `plugin (fastify, options, next)`
* Decorate it with one the exported Decorators (for example `Controller`)

```ts
// ./app/UserController.ts
import { Controller } from 'revane'

@Controller()
export class UserController {
  plugin (fastify, options, next) {
    fastify.get('/users', (request, reply) => {
      reply.send('hello world')
    })
    next()
  }
}
```

To set up the application simply tell it:

* where to find the root directory of your application
* where to scan for beans
* to register your controller at the fastify server

```ts
// ./app/Server.ts
import { revane } from 'revane'

revane()
  .basePackage(__dirname)
  .componentScan('./app')
  .registerControllers()
  .initialize()
```