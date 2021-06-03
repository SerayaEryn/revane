# Components

Controllers handle HTTP request
Components are classes declared to a component by a decorator.

Lets create a `RabbitService`, that stores our rabbits for now and will be
injected into the `RabbitController`.

```ts
import { Service } from 'revane';
import { Rabbit } from './Rabbit';

@Service
export class RabbitService {
  private readonly rabbits: Rabbit[] = [];

  create (rabbit: Rabbit) {
    this.rabbits.push(rabbit);
  }

  findAll (): Rabbit[] {
    return this.rabbits;
  }
}
```

The `RabbitService` is a simple class decorated with the `@Service` decorator. The `@Service` decorator declares the class to be a component managed by Revane.

The `Rabbit` might look like this:

```ts
// Rabbit.ts
export class Rabbit {
  constructor (
    public id: string,
    public color: string
  ) {}
}
```

## Dependency injection

Revane is using the design pattern known as dependency injection.

To inject a dependency, for example the `RabbitService`, into another component
declare it as a constructor parameter. Revane will create a singleton instance
of the `RabbitService` and pass it to the `RabbitController`'s constructor.

```ts
constructor(private rabbitService: RabbitService) {}
```

*Hint* The name of the constructor parameter matters. Since all typescript types
are being erased during compilation the constructor parameters name is being
used to resolve dependencies.  

## Scopes

A component has one the following scopes:

| Scope     | Decorator             | |
| singleton | `@Scope('singleton')` | A single instance of the component is shared in the applicaton. The singleton scope is used by default. |
| prototype | `@Scope('prototype')` | A new instance of the component is created for each other component depending on it.
