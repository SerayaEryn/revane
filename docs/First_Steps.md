# First Steps

## Language

Since Revane makes use of decorators [Typescript](https://www.typescriptlang.org/) or a Babel compiler is required.

The examples in the documentation use Typescript.

For a running example take a look at [revane-example](https://github.com/SerayaEryn/revane-example).

## Prerequisites

Please make sure that Node.js (>= 12.13.0) is installed on your operating
system.

## Setup

### Installation

Install the dependencies:
```ts
npm i revane@next
npm i typescript @types/node tslib --save-dev
```

### Typescript Compiler Configuration

Create a configuration file for the Typescript compiler `./ts.config.json` with the following content:

```json
{
  "compilerOptions": {
    "outDir": "./bin/",
    "noImplicitAny": false,
    "module": "CommonJS",
    "target": "ES2020",
    "importHelpers": true,
    "alwaysStrict": true,
    "lib": ["es2020"],
    "experimentalDecorators": true
  }
}
```

### Application Entrypoint

Create the application entrypoint `./src/Application.ts` with the following content:

```ts
// src/Application.ts
import { revane } from 'revane'

revane()
  .initialize()
  .catch(console.error)
```

### npm scripts

It is recommended to add scripts, that compile and start the application:

```json
{
  // ...
  "scripts": {
    "compile": "tsc",
    "start": "node ./src/Application.js"
  }
}
```

## Running the application

Start the application by using the `start` script:

```shell
npm run start
```
