# First Steps

## Language

## Prerequisites

Please make sure that Node.js (>= 12.13.0) is installed on your operating
system.

## Setup

```shell
npm i -g revane-cli
revane-cli new project-name
```

```ts
// Application.ts
import { revane } from 'revane'

revane()
  .initialize()
  .catch(console.error)
```

## Running the application

```shell
npm run start
```
