# Configuration

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

## Properties

The following Revane properties can be specified in your configuration files:

| key                                          | description                                                         | default     |
|----------------------------------------------|---------------------------------------------------------------------|-------------|
| revane.server.host                           | The host of the server.                                             | `localhost` |
| revane.server.port                           | The port of the server.                                             | `3000`      |
| revane.server.compression.enabled            | Enables compression                                                 | `false`     |
| revane.server.static-files.enabled           | Enables the serving of static files from `./static` & `./resources` | `false`     |
| revane.scheduling.enabled                    | Enables the scheduling of tasks.                                    | `false`     |
| revane.logging.enabled                       | Enables logging.                                                    | `true`      |
| revane.logging.rootLevel                     |                                                                     | `INFO`      |
| revane.logging.level                         |                                                                     | `INFO`      |
| revane.logging.file                          |                                                                     |             |
| revane.logging.path                          |                                                                     |             |
| revane.logging.format                        | The log forrmat: `JSON`, `SIMPLE`                                   | `SIMPLE`    |
| revane.main.allow-bean-definition-overriding | Allow overriding of beans.                                          | `false`     |
| revane.access-logging.enabled                | Enables basic access logging.                                       | `true`      |
| revane.scheduling.enabled                    | Enables the scheduling.                                             | `false`     |
| revane.favicon.enabled                       | Enables loading a `favicon.ico` from `./static`                     | `true`      |