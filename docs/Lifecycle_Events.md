# Lifecycle Events

## Lifecycle events

*since `3.0.0`*

```ts
import { Component, PostConstruct } from 'revane'

class RabbitService {
  @PostConstruct
  afterComponentInit () {
    // ...
  }
}

```

| Life cycle decorator | Event triggering the method call            |
|----------------------|---------------------------------------------|
| `@PostConstruct`     | Called when the component has been created. |
| `@PreDestroy`        | Called when the application is terminating. |
