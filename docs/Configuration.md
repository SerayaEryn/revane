# Configuration

*since `3.0.0`*

Configuration files a lookup in a `./config/` folder by default.

At least a `application.yml` is required. Additional configuration files for profiles can be added: `application-example.yml`.

Supported formats are:
- .yml
- .properties
- .json

## Profiles

The Profile can be passed to the application by providing the `REVANE_PROFILE` environment variable.

```sh
REVANE_PROFILE=example node bin/ExampleApplication.js
```

## Accesing Configuration Properties

The Configuration can be accessed by injecting it:

```ts
import { RevaneConfiguration, Component, Type } from 'revane'

class Example {
  constructor(@Type(RevaneConfiguration) configuration: RevaneConfiguration) {
    configuration.getString("a.property.of.type.string")
  }
}
```

## ConfigurationProperties

*since `3.0.0`*

Given the following configuration file:

```yml
example:
  value1: 42
  value2: test
```

The properties can be loaded from the configuration with the `@ConfigurationProperties` decorator.

```ts
@ConfigurationProperties({ prefix: 'example' })
export class ConfigurationPropertiesExample {
  value1: number
  value2: string

  setValue1 (value1: number) {
    this.value1 = value1
  }

  setValue2 (value2: string) {
    this.value2 = value2
  }
}
```


## Properties

The following Revane properties can be specified in your configuration files:

| key                                          | description                                                         | default          | since   |
|----------------------------------------------|---------------------------------------------------------------------|------------------|---------|
| revane.server.host                           | The host of the server.                                             | `localhost`      |         |
| revane.server.port                           | The port of the server.                                             | `3000`           |         |
| revane.server.compression.enabled            | Enables compression                                                 | `false`          | `3.1.0` |
| revane.server.static-files.enabled           | Enables the serving of static files from `./static` & `./resources` | `false`          | `3.2.0` |
| revane.server.body-limit                     | Maximum payload size.                                               | `1048576 (1MiB)` | `3.2.0` |
| revane.server.case-sensitive                 | Enables case sensitivity for routes.                                | `true`           | `3.2.0` |
| revane.server.request-id-header              | The header name used to set the request-id.                         | `request-id`     | `3.2.0` |
| revane.logging.enabled                       | Enables logging.                                                    | `true`           | `3.0.0` |
| revane.logging.rootLevel                     |                                                                     | `INFO`           | `3.0.0` |
| revane.logging.level                         |                                                                     | `INFO`           | `3.0.0` |
| revane.logging.file                          |                                                                     |                  | `3.0.0` |
| revane.logging.path                          |                                                                     |                  | `3.0.0` |
| revane.logging.format                        | The log forrmat: `JSON`, `SIMPLE`                                   | `SIMPLE`         | `3.0.0` |
| revane.main.allow-bean-definition-overriding | Allow overriding of beans.                                          | `false`          |         |
| revane.access-logging.enabled                | Enables basic access logging.                                       | `true`           | `3.0.0` |
| revane.scheduling.enabled                    | Enables the scheduling of tasks.                                    | `false`          | `3.1.0` |
| revane.favicon.enabled                       | Enables loading a `favicon.ico` from `./static`                     | `true`           | `3.1.0` |
