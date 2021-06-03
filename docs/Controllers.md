# Controllers

## Routing

The following example uses the `@Controller` decorator to declare a controller
that handles HTTP calls. The `@Get` decorator declares is being used to declare
a route. The name of the route needs to be passed to the `@Get` decorator.

```ts
// RabbitController.ts
import { Controller, Get } from 'revane';

@Controller
export class RabbitController {
  @Get('/rabbits/')
  findAll(): string[] {
    return ['white rabbit', 'blue rabbit'];
  }
}
```

There are docorators for each http method:

* `@Get`
* `@Post`
* `@Patch`
* `@Delete`
* `@Options`
* `@Head`
* `@Put`
* `@All`

## Request object

```ts
import { Controller, Get, RevaneRequest } from 'revane';

@Controller
export class RabbitController {
  @Get('/rabbits/')
  findAll(@Request request: RevaneRequest): string[] {
    return ['white rabbit', 'blue rabbit'];
  }
}
```

## Resources

```ts
import { Controller, Get, Post } from 'revane';

@Controller
export class RabbitController {
  @Post('/rabbits/')
  create(): string {
    return 'white rabbit';
  }

  @Get('/rabbits/')
  findAll(): string[] {
    return ['white rabbit', 'blue rabbit'];
  }
}
```

## Route parameters

```ts
import { Controller, Get, Param } from 'revane';

@Controller
export class RabbitController {
  // ...

  @Get('/rabbits/:id')
  find(@Param id: string): string[] {
    return 'white rabbit';
  }
}
```
