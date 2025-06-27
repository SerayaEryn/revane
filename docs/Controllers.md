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

  @Get('/rabbits/:id/')
  find(@Param id: string): string[] {
    return 'white rabbit';
  }
}
```

There are the following decorators that allow to access request data:

| decorator                      | description                             |
|--------------------------------|-----------------------------------------|
| `@Query("<name>")`, `@Query`   | provides the value of a query parameter |
| `@Param("<name>")`, `@Param`   | provides the value of a path variable   |
| `@Cookie("<name>")`, `@Cookie` | provides the value of a cookie          |
| `@Header("<name>")`, `@Header` | provides the value of a headers         |
| `@Request`                     | provides the request                    |
| `@Cookies`                     | provides all cookies                    |
| `@Params`                      | provides all path variables             |
| `@Headers`                     | provides all headers                    |
| `@QueryParameters`             | provides all query parameters           |
| `@Body`                        | provides the body of a post request     |
| `@Log`                         | provides a logger                       |

## Error Handlers

### Per Controller

```ts
import { Controller, ErrorHandler, ResponseStatus } from 'revane'

@Controller
export class RabbitController [
  @ErrorHandler('A_ERROR_CODE') 
  @ResponseStatus(505)
  async handleError1 (ignore, request, reply): Promise<string> {
    return 'something went wrong'
  }
]
```

## Global

```ts
import { Controller, ErrorHandler, ResponseStatus } from 'revane'

@ControllerAdvice
export class GlobalErrorHandler {
  @ErrorHandler
  @ResponseStatus(500)
  public async globalErrorHandler(error: Error): Promise<string> {
    return 'something went wrong'
  }
}
```

## ModelAttribute

*since `3.2.0`*

The `@ModelAttribute` decorator allows to bind request parameters, path variables, and more onto a model object:

```ts
import { Controller, Get, ModelAttribute } from 'revane'

@Controller
export class RabbitController {
  @Get('/rabbits/:id/')
  find(@ModelAttribute rabbit: Rabbit | null): string {
    return rabbit?.name;
  }
}
```

```ts
import { Component, Param, ModelAttribute } from 'revane'

@Component
export class RabbitLoader {
  constructor(public rabbitRepository: RabbitRepository) {}

  @ModelAttribut("rabbit")
  public async getRabbit(@Param id: string): Rabbit | null {
    return await this.rabbitRepository.findById(id)
  }
}
```