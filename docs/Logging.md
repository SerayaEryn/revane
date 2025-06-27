# Logging

*since `3.0.0`*

## Obtaining a logger

A logger instance can be obtained by adding a logger parameter to your class contructor:

```ts
import { Component, Logger } from 'revane'

@Component
export class MyClass {
  constructor(private logger: Logger) {}

  log() {
    this.logger.info('Hello World')
  }
}
```

## Log Format

The log format can be switched to json by adding the property `revane.logging.format=JSON` to your configuration file.